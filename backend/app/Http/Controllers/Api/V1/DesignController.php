<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDesignRequest;
use App\Http\Requests\UpdateDesignRequest;
use App\Http\Resources\DesignResource;
use App\Jobs\AnalyzeDesignJob;
use App\Jobs\GenerateVariationsJob;
use App\Models\Design;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;

class DesignController extends Controller
{
    /**
     * Get paginated list of user's designs.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $designs = $request->user()
            ->designs()
            ->withCount('variations')
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->when($request->category, fn ($q, $category) => $q->where('category', $category))
            ->when($request->search, fn ($q, $search) => $q->where('title', 'like', "%{$search}%"))
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 12);

        return DesignResource::collection($designs);
    }

    /**
     * Store a new design with file upload.
     */
    public function store(StoreDesignRequest $request): JsonResponse
    {
        $user = $request->user();
        $file = $request->file('design_file');

        // Store file in user-specific directory
        $path = $file->store(
            'designs/'.$user->id,
            'public'
        );

        $design = $user->designs()->create([
            'title' => $request->title,
            'description' => $request->description,
            'category' => $request->category,
            'season' => $request->season,
            'target_demographic' => $request->target_demographic,
            'file_path' => $path,
            'file_type' => $file->getMimeType(),
            'original_filename' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
            'status' => $request->status ?? 'draft',
            'ai_analysis_status' => 'pending',
        ]);

        // Dispatch AI analysis job
        AnalyzeDesignJob::dispatch($design);

        return response()->json([
            'message' => 'Design uploaded successfully.',
            'data' => new DesignResource($design),
        ], 201);
    }

    /**
     * Get a single design with variations.
     */
    public function show(Request $request, Design $design): JsonResponse
    {
        // Ensure user owns this design
        if ($design->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'You do not have permission to view this design.',
            ], 403);
        }

        $design->load('variations');
        $design->loadCount('variations');

        return response()->json([
            'data' => new DesignResource($design),
        ]);
    }

    /**
     * Update design metadata.
     */
    public function update(UpdateDesignRequest $request, Design $design): JsonResponse
    {
        $design->update($request->validated());

        return response()->json([
            'message' => 'Design updated successfully.',
            'data' => new DesignResource($design->fresh()),
        ]);
    }

    /**
     * Delete a design.
     */
    public function destroy(Request $request, Design $design): JsonResponse
    {
        // Ensure user owns this design
        if ($design->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'You do not have permission to delete this design.',
            ], 403);
        }

        // Delete file from storage
        if ($design->file_path) {
            Storage::disk('public')->delete($design->file_path);
        }

        // Delete variation files
        foreach ($design->variations as $variation) {
            if ($variation->file_path) {
                Storage::disk('public')->delete($variation->file_path);
            }
        }

        $design->delete();

        return response()->json([
            'message' => 'Design deleted successfully.',
        ]);
    }

    /**
     * Get design statistics for dashboard.
     */
    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'total_designs' => $user->designs()->count(),
            'active_designs' => $user->designs()->where('status', 'active')->count(),
            'draft_designs' => $user->designs()->where('status', 'draft')->count(),
            'pending_analysis' => $user->designs()->where('ai_analysis_status', 'pending')->count(),
        ]);
    }

    /**
     * Trigger or re-trigger AI analysis for a design.
     */
    public function triggerAnalysis(Request $request, Design $design): JsonResponse
    {
        // Ensure user owns this design
        if ($design->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'You do not have permission to analyze this design.',
            ], 403);
        }

        // Prevent re-analysis if already processing
        if ($design->ai_analysis_status === 'processing') {
            return response()->json([
                'message' => 'Analysis is already in progress.',
            ], 409);
        }

        // Reset status and dispatch job
        $design->update([
            'ai_analysis_status' => 'pending',
            'ai_analysis_result' => null,
            'trend_score' => null,
        ]);

        AnalyzeDesignJob::dispatch($design);

        return response()->json([
            'message' => 'AI analysis has been queued.',
            'data' => new DesignResource($design->fresh()),
        ]);
    }

    /**
     * Generate design variations.
     */
    public function generateVariations(Request $request, Design $design): JsonResponse
    {
        // Ensure user owns this design
        if ($design->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'You do not have permission to generate variations for this design.',
            ], 403);
        }

        // Ensure analysis is complete
        if (! $design->isAnalysisComplete()) {
            return response()->json([
                'message' => 'Design must be analyzed before generating variations.',
            ], 422);
        }

        // Check if variations already exist
        if ($design->variations()->count() > 0) {
            return response()->json([
                'message' => 'Variations have already been generated for this design.',
            ], 409);
        }

        $count = $request->input('count', 3);
        $count = max(1, min(5, (int) $count)); // Limit between 1-5

        GenerateVariationsJob::dispatch($design, $count);

        return response()->json([
            'message' => 'Variation generation has been queued.',
            'data' => new DesignResource($design),
        ]);
    }

    /**
     * Regenerate design variations (deletes existing ones).
     */
    public function regenerateVariations(Request $request, Design $design): JsonResponse
    {
        // Ensure user owns this design
        if ($design->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'You do not have permission to regenerate variations for this design.',
            ], 403);
        }

        // Ensure analysis is complete
        if (! $design->isAnalysisComplete()) {
            return response()->json([
                'message' => 'Design must be analyzed before generating variations.',
            ], 422);
        }

        // Delete existing variations and their files
        foreach ($design->variations as $variation) {
            if ($variation->file_path) {
                Storage::disk('public')->delete($variation->file_path);
            }
            $variation->delete();
        }

        $count = $request->input('count', 3);
        $count = max(1, min(5, (int) $count));

        GenerateVariationsJob::dispatch($design, $count);

        return response()->json([
            'message' => 'Variation regeneration has been queued.',
            'data' => new DesignResource($design->fresh()),
        ]);
    }
}
