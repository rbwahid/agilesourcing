<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\SupplierProfileRequest;
use App\Http\Resources\SupplierResource;
use App\Models\Supplier;
use App\Models\User;
use App\Services\Supplier\SupplierSearchService;
use App\Services\Supplier\SupplierStatsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SupplierController extends Controller
{
    public function __construct(
        private SupplierSearchService $searchService,
        private SupplierStatsService $statsService
    ) {}

    /**
     * Get a supplier's public profile.
     */
    public function show(Supplier $supplier, Request $request): JsonResponse
    {
        $supplier = $this->searchService->getSupplierWithDetails($supplier->id);

        if (! $supplier) {
            return response()->json([
                'message' => 'Supplier not found.',
            ], 404);
        }

        // Record profile view (get the user from the supplier)
        $supplierUser = $supplier->profile?->user;
        if ($supplierUser) {
            $this->statsService->recordProfileView($supplierUser, $request->user(), $request);
        }

        return response()->json([
            'data' => new SupplierResource($supplier),
        ]);
    }

    /**
     * Record a profile view (explicit endpoint).
     */
    public function recordView(Supplier $supplier, Request $request): JsonResponse
    {
        $supplierUser = $supplier->profile?->user;

        if (! $supplierUser) {
            return response()->json([
                'message' => 'Supplier not found.',
            ], 404);
        }

        $this->statsService->recordProfileView($supplierUser, $request->user(), $request);

        return response()->json([
            'message' => 'View recorded.',
        ]);
    }

    /**
     * Get the authenticated supplier's own profile.
     */
    public function profile(Request $request): JsonResponse
    {
        $user = $request->user();
        $profile = $user->profile;

        if (! $profile || ! $profile->supplier) {
            return response()->json([
                'message' => 'Supplier profile not found.',
            ], 404);
        }

        $supplier = $profile->supplier->load(['certificationRecords', 'productCatalog']);

        return response()->json([
            'data' => new SupplierResource($supplier),
        ]);
    }

    /**
     * Update the authenticated supplier's profile.
     */
    public function update(SupplierProfileRequest $request): JsonResponse
    {
        $user = $request->user();
        $profile = $user->profile;

        if (! $profile) {
            return response()->json([
                'message' => 'Profile not found.',
            ], 404);
        }

        // Update profile fields
        $profile->update([
            'business_name' => $request->business_name,
            'bio' => $request->bio,
            'location' => $request->location,
            'website_url' => $request->website_url,
            'phone' => $request->phone,
        ]);

        // Get or create supplier record
        $supplier = $profile->supplier;
        if (! $supplier) {
            $supplier = $profile->supplier()->create([
                'service_type' => $request->service_type,
            ]);
        }

        // Update supplier-specific fields
        $supplier->update([
            'service_type' => $request->service_type,
            'minimum_order_quantity' => $request->minimum_order_quantity,
            'lead_time_days' => $request->lead_time_days,
            'production_capacity' => $request->production_capacity,
            'response_time_hours' => $request->response_time_hours,
            'certifications' => $request->specialties ?? [],
        ]);

        // Mark onboarding as complete if all required fields are filled
        if (! $profile->onboarding_completed_at &&
            $profile->business_name &&
            $profile->location &&
            $supplier->service_type) {
            $profile->update([
                'onboarding_completed_at' => now(),
            ]);
        }

        $supplier->load(['profile', 'certificationRecords', 'productCatalog']);

        return response()->json([
            'message' => 'Profile updated successfully.',
            'data' => new SupplierResource($supplier),
        ]);
    }

    /**
     * Upload supplier logo (profile image).
     */
    public function uploadLogo(Request $request): JsonResponse
    {
        $request->validate([
            'logo' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:5120'],
        ]);

        $user = $request->user();
        $profile = $user->profile;

        if (! $profile) {
            return response()->json([
                'message' => 'Profile not found.',
            ], 404);
        }

        // Delete old logo if exists
        if ($profile->profile_image_path) {
            Storage::disk('private')->delete($profile->profile_image_path);
        }

        // Store new logo on private disk
        $path = $request->file('logo')->store(
            'profiles/'.$user->id,
            'private'
        );

        $profile->update([
            'profile_image_path' => $path,
        ]);

        return response()->json([
            'message' => 'Logo uploaded successfully.',
            'data' => [
                'logo_url' => route('files.serve', [
                    'type' => 'profiles',
                    'id' => $user->id,
                    'filename' => basename($path),
                ]),
            ],
        ]);
    }

    /**
     * Get supplier statistics for dashboard.
     */
    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user->isSupplier()) {
            return response()->json([
                'message' => 'Only suppliers can access stats.',
            ], 403);
        }

        $stats = $this->statsService->getStats($user);

        // Add additional supplier-specific info
        $profile = $user->profile;
        $supplier = $profile?->supplier;

        if ($supplier) {
            $stats['certifications_count'] = $supplier->certificationRecords()->count();
            $stats['catalog_items_count'] = $supplier->productCatalog()->where('is_active', true)->count();
            $stats['is_verified'] = $supplier->is_verified;
            $stats['is_featured'] = $supplier->is_featured;
        }

        return response()->json($stats);
    }

    /**
     * Get profile views timeline for charts.
     */
    public function viewsTimeline(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user->isSupplier()) {
            return response()->json([
                'message' => 'Only suppliers can access stats.',
            ], 403);
        }

        $days = (int) $request->input('days', 30);
        $days = min(max($days, 7), 90); // Limit between 7 and 90 days

        $timeline = $this->statsService->getViewsTimeline($user, $days);

        return response()->json([
            'data' => $timeline,
        ]);
    }

    /**
     * Get supplier's recent activity.
     */
    public function activity(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user->isSupplier()) {
            return response()->json([
                'message' => 'Only suppliers can access activity.',
            ], 403);
        }

        $limit = (int) $request->input('limit', 10);
        $limit = min(max($limit, 5), 50); // Limit between 5 and 50

        $activity = $this->statsService->getRecentActivity($user, $limit);

        return response()->json([
            'data' => $activity,
        ]);
    }
}
