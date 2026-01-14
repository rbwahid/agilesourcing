<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Requests\UploadProfileImageRequest;
use App\Http\Resources\ProfileResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    /**
     * Get the authenticated user's profile.
     */
    public function show(Request $request): ProfileResource
    {
        $user = $request->user();

        // Create profile if it doesn't exist
        if (! $user->profile) {
            $user->profile()->create([
                'type' => $user->role === 'supplier' ? 'supplier' : 'designer',
                'business_name' => $user->name,
            ]);
            $user->refresh();
        }

        return new ProfileResource($user->profile);
    }

    /**
     * Update the authenticated user's profile.
     */
    public function update(UpdateProfileRequest $request): ProfileResource
    {
        $user = $request->user();

        // Create profile if it doesn't exist
        if (! $user->profile) {
            $user->profile()->create([
                'type' => $user->role === 'supplier' ? 'supplier' : 'designer',
                'business_name' => $user->name,
            ]);
            $user->refresh();
        }

        $user->profile->update($request->validated());

        return new ProfileResource($user->profile->fresh());
    }

    /**
     * Mark onboarding as complete.
     */
    public function completeOnboarding(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user->profile) {
            return response()->json([
                'message' => 'Profile not found. Please complete your profile first.',
            ], 404);
        }

        // Validate required fields for onboarding completion
        if (empty($user->profile->business_name)) {
            return response()->json([
                'message' => 'Please provide your business name before completing onboarding.',
            ], 422);
        }

        $user->profile->update([
            'onboarding_completed_at' => now(),
        ]);

        return response()->json([
            'message' => 'Onboarding completed successfully!',
            'profile' => new ProfileResource($user->profile->fresh()),
        ]);
    }

    /**
     * Upload profile image.
     */
    public function uploadImage(UploadProfileImageRequest $request): JsonResponse
    {
        $user = $request->user();

        if (! $user->profile) {
            return response()->json([
                'message' => 'Profile not found.',
            ], 404);
        }

        // Delete old image if exists
        if ($user->profile->profile_image_path) {
            Storage::disk('private')->delete($user->profile->profile_image_path);
        }

        // Store new image on private disk
        $path = $request->file('image')->store(
            'profiles/'.$user->id,
            'private'
        );

        $user->profile->update([
            'profile_image_path' => $path,
        ]);

        return response()->json([
            'message' => 'Profile image uploaded successfully.',
            'profile_image_path' => $path,
            'profile_image_url' => route('files.serve', [
                'type' => 'profiles',
                'id' => $user->id,
                'filename' => basename($path),
            ]),
        ]);
    }

    /**
     * Delete profile image.
     */
    public function deleteImage(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user->profile || ! $user->profile->profile_image_path) {
            return response()->json([
                'message' => 'No profile image to delete.',
            ], 404);
        }

        Storage::disk('private')->delete($user->profile->profile_image_path);

        $user->profile->update([
            'profile_image_path' => null,
        ]);

        return response()->json([
            'message' => 'Profile image deleted successfully.',
        ]);
    }
}
