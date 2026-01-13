<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlanController extends Controller
{
    /**
     * List all active plans, optionally filtered by user type.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Plan::active()->orderBy('price_monthly', 'asc');

        // Filter by user type if provided
        if ($request->has('user_type')) {
            $userType = $request->input('user_type');
            if (in_array($userType, ['designer', 'supplier'])) {
                $query->where('user_type', $userType);
            }
        }

        $plans = $query->get();

        return response()->json([
            'data' => $plans->map(fn (Plan $plan) => $this->formatPlan($plan)),
        ]);
    }

    /**
     * Get a single plan by slug.
     */
    public function show(Plan $plan): JsonResponse
    {
        if (!$plan->is_active) {
            return response()->json([
                'message' => 'Plan not found.',
            ], 404);
        }

        return response()->json([
            'data' => $this->formatPlan($plan),
        ]);
    }

    /**
     * Format plan data for API response.
     */
    private function formatPlan(Plan $plan): array
    {
        return [
            'id' => $plan->id,
            'name' => $plan->name,
            'slug' => $plan->slug,
            'user_type' => $plan->user_type,
            'price_monthly' => (float) $plan->price_monthly,
            'price_annual' => (float) $plan->price_annual,
            'features' => $plan->features ?? [],
            'design_uploads_limit' => $plan->design_uploads_limit,
            'validations_limit' => $plan->validations_limit,
            'has_unlimited_uploads' => $plan->hasUnlimitedUploads(),
            'has_unlimited_validations' => $plan->hasUnlimitedValidations(),
            'is_active' => $plan->is_active,
        ];
    }
}
