<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\MockupRequest;
use App\Jobs\GenerateMockupJob;
use App\Models\Design;
use App\Models\Mockup;
use App\Services\AI\MockupGeneratorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MockupController extends Controller
{
    public function __construct(
        private MockupGeneratorService $generatorService
    ) {}

    /**
     * Get all mockups for a design.
     */
    public function index(Request $request, Design $design): JsonResponse
    {
        // Ensure user owns this design
        if ($design->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Design not found.',
            ], 404);
        }

        $mockups = $design->mockups()
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($mockup) => $this->formatMockup($mockup));

        return response()->json([
            'data' => $mockups,
        ]);
    }

    /**
     * Create a new mockup for a design.
     */
    public function store(MockupRequest $request, Design $design): JsonResponse
    {
        // Ensure user owns this design
        if ($design->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Design not found.',
            ], 404);
        }

        // Check if design analysis is complete (required for good prompts)
        if ($design->ai_analysis_status !== 'completed') {
            return response()->json([
                'message' => 'Please wait for AI analysis to complete before generating mockups.',
            ], 400);
        }

        // Create the mockup record
        $mockup = $this->generatorService->generateMockup(
            $design,
            $request->model_type,
            $request->pose,
            $request->background,
            $request->design_variation_id
        );

        // Dispatch the job to generate the image
        GenerateMockupJob::dispatch($mockup);

        return response()->json([
            'message' => 'Mockup generation started.',
            'data' => $this->formatMockup($mockup),
        ], 202);
    }

    /**
     * Get a single mockup.
     */
    public function show(Request $request, Mockup $mockup): JsonResponse
    {
        // Ensure user owns this mockup's design
        if ($mockup->design->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Mockup not found.',
            ], 404);
        }

        return response()->json([
            'data' => $this->formatMockup($mockup),
        ]);
    }

    /**
     * Delete a mockup.
     */
    public function destroy(Request $request, Mockup $mockup): JsonResponse
    {
        // Ensure user owns this mockup's design
        if ($mockup->design->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Mockup not found.',
            ], 404);
        }

        // Check if mockup is used in any active validations
        $activeValidations = $mockup->validations()
            ->whereIn('status', ['pending', 'active'])
            ->count();

        if ($activeValidations > 0) {
            return response()->json([
                'message' => 'Cannot delete mockup that is being used in active validations.',
            ], 400);
        }

        // Delete the file if it exists
        if ($mockup->file_path && Storage::disk('private')->exists($mockup->file_path)) {
            Storage::disk('private')->delete($mockup->file_path);
        }

        $mockup->delete();

        return response()->json([
            'message' => 'Mockup deleted successfully.',
        ]);
    }

    /**
     * Format mockup for API response.
     */
    private function formatMockup(Mockup $mockup): array
    {
        return [
            'id' => $mockup->id,
            'design_id' => $mockup->design_id,
            'design_variation_id' => $mockup->design_variation_id,
            'model_type' => $mockup->model_type,
            'pose' => $mockup->pose,
            'background' => $mockup->background,
            'file_path' => $mockup->file_path,
            'file_url' => $mockup->file_url,
            'status' => $mockup->status,
            'error_message' => $mockup->error_message,
            'created_at' => $mockup->created_at,
            'updated_at' => $mockup->updated_at,
        ];
    }
}
