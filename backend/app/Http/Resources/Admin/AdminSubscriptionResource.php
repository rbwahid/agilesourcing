<?php

namespace App\Http\Resources\Admin;

use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminSubscriptionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        $plan = $this->resolvePlan();
        $billingPeriod = $this->determineBillingPeriod();
        $amount = $this->calculateMonthlyAmount($plan, $billingPeriod);

        return [
            'id' => $this->id,
            'stripe_id' => $this->stripe_id,
            'stripe_status' => $this->stripe_status,
            'stripe_price' => $this->stripe_price,
            'billing_period' => $billingPeriod,
            'trial_ends_at' => $this->trial_ends_at?->toIso8601String(),
            'ends_at' => $this->ends_at?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
                'role' => $this->user->role,
            ],
            'plan' => $plan ? [
                'id' => $plan->id,
                'name' => $plan->name,
                'slug' => $plan->slug,
            ] : null,
            'amount' => $amount,
        ];
    }

    /**
     * Resolve the plan from the Stripe price ID.
     */
    private function resolvePlan(): ?Plan
    {
        if (! $this->stripe_price) {
            return null;
        }

        return Plan::where('stripe_price_monthly_id', $this->stripe_price)
            ->orWhere('stripe_price_annual_id', $this->stripe_price)
            ->first();
    }

    /**
     * Determine if this is a monthly or annual subscription.
     */
    private function determineBillingPeriod(): string
    {
        if (! $this->stripe_price) {
            return 'monthly';
        }

        $plan = Plan::where('stripe_price_monthly_id', $this->stripe_price)->first();

        if ($plan) {
            return 'monthly';
        }

        $plan = Plan::where('stripe_price_annual_id', $this->stripe_price)->first();

        if ($plan) {
            return 'annual';
        }

        return 'monthly';
    }

    /**
     * Calculate the monthly equivalent amount.
     */
    private function calculateMonthlyAmount(?Plan $plan, string $billingPeriod): int
    {
        if (! $plan) {
            return 0;
        }

        if ($billingPeriod === 'annual') {
            // Return monthly equivalent (annual price / 12), converted to cents
            return (int) round(($plan->price_annual / 12) * 100);
        }

        return (int) ($plan->price_monthly * 100);
    }
}
