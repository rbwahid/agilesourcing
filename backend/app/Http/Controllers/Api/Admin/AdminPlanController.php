<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdatePlanRequest;
use App\Http\Resources\Admin\AdminPlanResource;
use App\Models\Plan;
use App\Services\PlanService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminPlanController extends Controller
{
    public function __construct(
        private PlanService $planService
    ) {}

    /**
     * List all plans (including inactive).
     */
    public function index(): AnonymousResourceCollection
    {
        $plans = Plan::withCount('subscriptions')
            ->orderBy('user_type')
            ->orderBy('price_monthly')
            ->get();

        return AdminPlanResource::collection($plans);
    }

    /**
     * Get a single plan with details.
     */
    public function show(Plan $plan): AdminPlanResource
    {
        $plan->loadCount('subscriptions');

        return new AdminPlanResource($plan);
    }

    /**
     * Update a plan.
     */
    public function update(UpdatePlanRequest $request, Plan $plan): AdminPlanResource
    {
        $plan = $this->planService->updatePlan($plan, $request->validated());
        $plan->loadCount('subscriptions');

        return new AdminPlanResource($plan);
    }

    /**
     * Toggle plan active status.
     */
    public function toggleActive(Plan $plan): JsonResponse
    {
        // Don't allow deactivating a plan with active subscribers
        if ($plan->is_active && $plan->subscriptions()->where('stripe_status', 'active')->exists()) {
            return response()->json([
                'message' => 'Cannot deactivate a plan with active subscribers.',
            ], 422);
        }

        $plan->update(['is_active' => ! $plan->is_active]);

        return response()->json([
            'message' => $plan->is_active ? 'Plan activated.' : 'Plan deactivated.',
            'is_active' => $plan->is_active,
        ]);
    }

    /**
     * Sync plan with Stripe (create/update product and prices).
     */
    public function syncStripe(Plan $plan): JsonResponse
    {
        try {
            $result = $this->planService->syncWithStripe($plan);

            return response()->json([
                'message' => 'Plan synced with Stripe successfully.',
                'stripe_product_id' => $result['product_id'],
                'stripe_price_monthly_id' => $result['price_monthly_id'],
                'stripe_price_annual_id' => $result['price_annual_id'],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to sync with Stripe.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
