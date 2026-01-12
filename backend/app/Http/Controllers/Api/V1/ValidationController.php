<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ValidationRequest;
use App\Jobs\PostToInstagramJob;
use App\Models\Mockup;
use App\Models\Validation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ValidationController extends Controller
{
    /**
     * Get all validations for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $validations = Validation::query()
            ->whereHas('design', fn ($q) => $q->where('user_id', $user->id))
            ->with(['design:id,title,file_path', 'mockup:id,file_path,file_url,status'])
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 12);

        return response()->json([
            'data' => $validations->items(),
            'meta' => [
                'current_page' => $validations->currentPage(),
                'last_page' => $validations->lastPage(),
                'per_page' => $validations->perPage(),
                'total' => $validations->total(),
            ],
        ]);
    }

    /**
     * Create a new validation campaign.
     */
    public function store(ValidationRequest $request): JsonResponse
    {
        $user = $request->user();

        // Verify Instagram connection
        $instagramConnection = $user->instagramConnection;
        if (! $instagramConnection) {
            return response()->json([
                'message' => 'Please connect your Instagram account first.',
            ], 400);
        }

        if ($instagramConnection->isTokenExpired()) {
            return response()->json([
                'message' => 'Your Instagram connection has expired. Please reconnect.',
            ], 400);
        }

        // Verify mockup ownership and status
        $mockup = Mockup::find($request->mockup_id);
        if (! $mockup || $mockup->design->user_id !== $user->id) {
            return response()->json([
                'message' => 'Mockup not found.',
            ], 404);
        }

        if (! $mockup->isCompleted()) {
            return response()->json([
                'message' => 'Mockup is not ready. Please wait for generation to complete.',
            ], 400);
        }

        // Create the validation record
        $validation = Validation::create([
            'design_id' => $mockup->design_id,
            'variation_id' => $mockup->design_variation_id,
            'instagram_connection_id' => $instagramConnection->id,
            'mockup_id' => $mockup->id,
            'caption' => $request->caption,
            'validation_duration_hours' => $request->validation_duration_hours,
            'status' => 'pending',
        ]);

        // Dispatch job to post to Instagram
        PostToInstagramJob::dispatch($validation);

        Log::info('Validation campaign created', [
            'validation_id' => $validation->id,
            'design_id' => $mockup->design_id,
            'duration_hours' => $request->validation_duration_hours,
        ]);

        return response()->json([
            'message' => 'Validation campaign started. Your design will be posted to Instagram shortly.',
            'data' => $this->formatValidation($validation->fresh(['design', 'mockup'])),
        ], 202);
    }

    /**
     * Get a single validation with details.
     */
    public function show(Request $request, Validation $validation): JsonResponse
    {
        // Ensure user owns this validation
        if ($validation->design->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Validation not found.',
            ], 404);
        }

        $validation->load(['design', 'mockup', 'instagramConnection']);

        return response()->json([
            'data' => $this->formatValidation($validation, true),
        ]);
    }

    /**
     * Get validation metrics/insights.
     */
    public function metrics(Request $request, Validation $validation): JsonResponse
    {
        // Ensure user owns this validation
        if ($validation->design->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Validation not found.',
            ], 404);
        }

        $hourlyMetrics = $validation->hourly_metrics ?? [];
        $totalEngagement = $validation->total_engagement;

        // Find peak hour
        $peakHour = null;
        $peakEngagement = 0;
        foreach ($hourlyMetrics as $metric) {
            $engagement = ($metric['likes'] ?? 0) + ($metric['comments'] ?? 0) +
                          ($metric['shares'] ?? 0) + ($metric['saves'] ?? 0);
            if ($engagement > $peakEngagement) {
                $peakEngagement = $engagement;
                $peakHour = $metric['timestamp'] ?? null;
            }
        }

        return response()->json([
            'data' => [
                'validation_id' => $validation->id,
                'status' => $validation->status,
                'total_engagement' => $totalEngagement,
                'likes_count' => $validation->likes_count,
                'comments_count' => $validation->comments_count,
                'shares_count' => $validation->shares_count,
                'saves_count' => $validation->saves_count,
                'engagement_rate' => $validation->engagement_rate,
                'validation_score' => $validation->validation_score,
                'peak_hour' => $peakHour,
                'hourly_breakdown' => $hourlyMetrics,
                'time_remaining' => $validation->time_remaining,
                'has_ended' => $validation->hasEnded(),
            ],
        ]);
    }

    /**
     * Cancel an active validation.
     */
    public function cancel(Request $request, Validation $validation): JsonResponse
    {
        // Ensure user owns this validation
        if ($validation->design->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Validation not found.',
            ], 404);
        }

        // Can only cancel pending or active validations
        if (! in_array($validation->status, ['pending', 'active'])) {
            return response()->json([
                'message' => 'Cannot cancel a validation that is already completed or failed.',
            ], 400);
        }

        $validation->update(['status' => 'cancelled']);

        Log::info('Validation cancelled', [
            'validation_id' => $validation->id,
        ]);

        return response()->json([
            'message' => 'Validation cancelled successfully.',
        ]);
    }

    /**
     * Format validation for API response.
     */
    private function formatValidation(Validation $validation, bool $detailed = false): array
    {
        $data = [
            'id' => $validation->id,
            'design_id' => $validation->design_id,
            'design' => $validation->design ? [
                'id' => $validation->design->id,
                'title' => $validation->design->title,
            ] : null,
            'mockup' => $validation->mockup ? [
                'id' => $validation->mockup->id,
                'file_url' => $validation->mockup->file_url,
            ] : null,
            'instagram_post_id' => $validation->instagram_post_id,
            'instagram_post_url' => $validation->instagram_post_url,
            'caption' => $validation->caption,
            'status' => $validation->status,
            'validation_duration_hours' => $validation->validation_duration_hours,
            'posted_at' => $validation->posted_at,
            'validation_ends_at' => $validation->validation_ends_at,
            'time_remaining' => $validation->time_remaining,
            'likes_count' => $validation->likes_count,
            'comments_count' => $validation->comments_count,
            'shares_count' => $validation->shares_count,
            'saves_count' => $validation->saves_count,
            'engagement_rate' => $validation->engagement_rate,
            'validation_score' => $validation->validation_score,
            'created_at' => $validation->created_at,
        ];

        if ($detailed) {
            $data['hourly_metrics'] = $validation->hourly_metrics;
            $data['instagram_connection'] = $validation->instagramConnection ? [
                'username' => $validation->instagramConnection->instagram_username,
                'followers_count' => $validation->instagramConnection->followers_count,
            ] : null;
        }

        return $data;
    }
}
