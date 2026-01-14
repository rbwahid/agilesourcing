<?php

namespace App\Services;

use App\Models\Design;
use App\Models\Plan;
use App\Models\User;
use App\Models\Validation;
use Carbon\Carbon;
use Laravel\Cashier\Subscription;

class SubscriptionService
{
    /**
     * Get the user's current plan based on their subscription.
     */
    public function getCurrentPlan(User $user): ?Plan
    {
        $subscription = $user->subscription('default');

        if (! $subscription) {
            return null;
        }

        // Find plan by Stripe price ID
        $stripePriceId = $subscription->stripe_price;

        return Plan::where('stripe_price_monthly_id', $stripePriceId)
            ->orWhere('stripe_price_annual_id', $stripePriceId)
            ->first();
    }

    /**
     * Check if the user can perform a specific action based on their plan limits.
     */
    public function checkLimit(User $user, string $feature): bool
    {
        $plan = $this->getCurrentPlan($user);

        if (! $plan) {
            // No active subscription, check trial
            if ($user->onTrial()) {
                // Trial users get Designer Basic limits
                $plan = Plan::where('slug', 'designer-basic')->first();
                if (! $plan) {
                    return false;
                }
            } else {
                return false;
            }
        }

        $usage = $this->getUsage($user);

        switch ($feature) {
            case 'design_uploads':
                if ($plan->hasUnlimitedUploads()) {
                    return true;
                }

                return $usage['design_uploads']['used'] < $plan->design_uploads_limit;

            case 'validations':
                if ($plan->hasUnlimitedValidations()) {
                    return true;
                }

                return $usage['validations']['used'] < $plan->validations_limit;

            default:
                return true;
        }
    }

    /**
     * Get the current usage statistics for the user.
     */
    public function getUsage(User $user): array
    {
        $subscription = $user->subscription('default');
        $plan = $this->getCurrentPlan($user);

        // Determine the billing period start date
        $periodStart = $this->getBillingPeriodStart($user);

        // Count designs created in this billing period
        $designUploadsUsed = Design::where('user_id', $user->id)
            ->where('created_at', '>=', $periodStart)
            ->count();

        // Count validations created in this billing period
        $validationsUsed = Validation::whereHas('design', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->where('created_at', '>=', $periodStart)
            ->count();

        return [
            'design_uploads' => [
                'used' => $designUploadsUsed,
                'limit' => $plan?->design_uploads_limit,
            ],
            'validations' => [
                'used' => $validationsUsed,
                'limit' => $plan?->validations_limit,
            ],
            'billing_period_start' => $periodStart?->toIso8601String(),
            'billing_period_end' => $this->getBillingPeriodEnd($user)?->toIso8601String(),
        ];
    }

    /**
     * Get the start of the current billing period.
     */
    public function getBillingPeriodStart(User $user): ?Carbon
    {
        $subscription = $user->subscription('default');

        if ($subscription && $subscription->stripe_id) {
            try {
                // Get the current period start from Stripe
                $stripeSubscription = $user->asStripeCustomer()
                    ->subscriptions
                    ->retrieve($subscription->stripe_id);

                return Carbon::createFromTimestamp($stripeSubscription->current_period_start);
            } catch (\Exception $e) {
                // Fallback to subscription created date
                return $subscription->created_at;
            }
        }

        // For trial users, use trial start (or registration date)
        if ($user->onTrial()) {
            return $user->created_at;
        }

        return null;
    }

    /**
     * Get the end of the current billing period.
     */
    public function getBillingPeriodEnd(User $user): ?Carbon
    {
        $subscription = $user->subscription('default');

        if ($subscription && $subscription->stripe_id) {
            try {
                $stripeSubscription = $user->asStripeCustomer()
                    ->subscriptions
                    ->retrieve($subscription->stripe_id);

                return Carbon::createFromTimestamp($stripeSubscription->current_period_end);
            } catch (\Exception $e) {
                return null;
            }
        }

        // For trial users
        if ($user->onTrial() && $user->trial_ends_at) {
            return Carbon::parse($user->trial_ends_at);
        }

        return null;
    }

    /**
     * Check if the user has an active subscription (including trial).
     */
    public function hasActiveSubscription(User $user): bool
    {
        // Check for active subscription
        if ($user->subscribed('default')) {
            return true;
        }

        // Check for active trial
        if ($user->onTrial()) {
            return true;
        }

        return false;
    }

    /**
     * Get subscription status details for the user.
     */
    public function getSubscriptionStatus(User $user): array
    {
        $subscription = $user->subscription('default');
        $plan = $this->getCurrentPlan($user);

        if (! $subscription) {
            // Check if on trial
            if ($user->onTrial()) {
                return [
                    'status' => 'trialing',
                    'plan' => $this->getTrialPlan(),
                    'trial_ends_at' => $user->trial_ends_at?->toIso8601String(),
                    'on_trial' => true,
                    'on_grace_period' => false,
                    'cancel_at_period_end' => false,
                ];
            }

            return [
                'status' => 'inactive',
                'plan' => null,
                'on_trial' => false,
                'on_grace_period' => false,
                'cancel_at_period_end' => false,
            ];
        }

        return [
            'id' => $subscription->id,
            'stripe_id' => $subscription->stripe_id,
            'status' => $subscription->stripe_status,
            'plan' => $plan ? $this->formatPlan($plan) : null,
            'stripe_price' => $subscription->stripe_price,
            'billing_period' => $this->getBillingPeriod($subscription),
            'current_period_start' => $this->getBillingPeriodStart($user)?->toIso8601String(),
            'current_period_end' => $this->getBillingPeriodEnd($user)?->toIso8601String(),
            'trial_ends_at' => $subscription->trial_ends_at?->toIso8601String(),
            'ends_at' => $subscription->ends_at?->toIso8601String(),
            'on_trial' => $subscription->onTrial(),
            'on_grace_period' => $subscription->onGracePeriod(),
            'cancel_at_period_end' => $subscription->ends_at !== null && ! $subscription->ended(),
        ];
    }

    /**
     * Determine the billing period (monthly or annual) from the subscription.
     */
    private function getBillingPeriod(Subscription $subscription): string
    {
        // Check which price ID is being used
        $plan = Plan::where('stripe_price_monthly_id', $subscription->stripe_price)->first();

        if ($plan) {
            return 'monthly';
        }

        $plan = Plan::where('stripe_price_annual_id', $subscription->stripe_price)->first();

        if ($plan) {
            return 'annual';
        }

        return 'monthly'; // Default fallback
    }

    /**
     * Get the default trial plan (Designer Basic).
     */
    private function getTrialPlan(): ?array
    {
        $plan = Plan::where('slug', 'designer-basic')->first();

        return $plan ? $this->formatPlan($plan) : null;
    }

    /**
     * Format plan for API response.
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
        ];
    }
}
