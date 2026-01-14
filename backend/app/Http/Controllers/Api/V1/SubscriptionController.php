<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubscriptionRequest;
use App\Models\Plan;
use App\Notifications\SubscriptionCreatedNotification;
use App\Services\SubscriptionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class SubscriptionController extends Controller
{
    public function __construct(
        private SubscriptionService $subscriptionService
    ) {}

    /**
     * Get the current user's subscription status.
     */
    public function current(Request $request): JsonResponse
    {
        $user = $request->user();
        $status = $this->subscriptionService->getSubscriptionStatus($user);

        return response()->json([
            'data' => $status,
        ]);
    }

    /**
     * Subscribe to a plan.
     */
    public function subscribe(SubscriptionRequest $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        // Check if user already has an active subscription
        if ($user->subscribed('default') && ! $user->subscription('default')->onGracePeriod()) {
            throw ValidationException::withMessages([
                'subscription' => ['You already have an active subscription. Use the change plan endpoint to switch plans.'],
            ]);
        }

        // Get the plan
        $plan = Plan::where('slug', $validated['plan_slug'])->firstOrFail();

        // Verify plan matches user type
        if ($plan->user_type !== $user->role) {
            throw ValidationException::withMessages([
                'plan_slug' => ['This plan is not available for your account type.'],
            ]);
        }

        // Get the Stripe price ID
        $stripePriceId = $plan->getStripePriceId($validated['billing_period']);

        if (! $stripePriceId) {
            throw ValidationException::withMessages([
                'plan_slug' => ['This plan is not yet available for subscription. Please contact support.'],
            ]);
        }

        try {
            // If resuming from grace period
            if ($user->subscription('default')?->onGracePeriod()) {
                $subscription = $user->subscription('default')->resume();
            } else {
                // Create new subscription
                $subscriptionBuilder = $user->newSubscription('default', $stripePriceId);

                // Add 14-day trial for first-time subscribers
                if (! $user->hasEverSubscribed()) {
                    $subscriptionBuilder->trialDays(14);
                }

                // Add payment method if provided
                if (! empty($validated['payment_method_id'])) {
                    $subscription = $subscriptionBuilder->create($validated['payment_method_id']);
                } else {
                    // Use default payment method
                    $subscription = $subscriptionBuilder->create();
                }

                // Send welcome notification
                $user->notify(new SubscriptionCreatedNotification($plan, $validated['billing_period']));
            }

            return response()->json([
                'message' => 'Subscription created successfully.',
                'data' => $this->subscriptionService->getSubscriptionStatus($user),
            ], 201);
        } catch (\Laravel\Cashier\Exceptions\IncompletePayment $e) {
            return response()->json([
                'message' => 'Additional payment authentication required.',
                'payment_intent' => $e->payment->id,
                'client_secret' => $e->payment->clientSecret(),
            ], 402);
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'subscription' => ['Failed to create subscription: '.$e->getMessage()],
            ]);
        }
    }

    /**
     * Change to a different plan.
     */
    public function changePlan(SubscriptionRequest $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        // Check if user has an active subscription
        if (! $user->subscribed('default')) {
            throw ValidationException::withMessages([
                'subscription' => ['You do not have an active subscription. Use the subscribe endpoint instead.'],
            ]);
        }

        // Get the new plan
        $plan = Plan::where('slug', $validated['plan_slug'])->firstOrFail();

        // Verify plan matches user type
        if ($plan->user_type !== $user->role) {
            throw ValidationException::withMessages([
                'plan_slug' => ['This plan is not available for your account type.'],
            ]);
        }

        // Get the Stripe price ID
        $stripePriceId = $plan->getStripePriceId($validated['billing_period']);

        if (! $stripePriceId) {
            throw ValidationException::withMessages([
                'plan_slug' => ['This plan is not yet available for subscription. Please contact support.'],
            ]);
        }

        try {
            // Swap to the new plan (proration is handled automatically by Stripe)
            $user->subscription('default')->swap($stripePriceId);

            return response()->json([
                'message' => 'Plan changed successfully.',
                'data' => $this->subscriptionService->getSubscriptionStatus($user),
            ]);
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'subscription' => ['Failed to change plan: '.$e->getMessage()],
            ]);
        }
    }

    /**
     * Cancel the subscription at the end of the billing period.
     */
    public function cancel(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user->subscribed('default')) {
            throw ValidationException::withMessages([
                'subscription' => ['You do not have an active subscription to cancel.'],
            ]);
        }

        try {
            $user->subscription('default')->cancel();

            return response()->json([
                'message' => 'Subscription will be cancelled at the end of the billing period.',
                'data' => $this->subscriptionService->getSubscriptionStatus($user),
            ]);
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'subscription' => ['Failed to cancel subscription: '.$e->getMessage()],
            ]);
        }
    }

    /**
     * Resume a cancelled subscription (during grace period).
     */
    public function resume(Request $request): JsonResponse
    {
        $user = $request->user();
        $subscription = $user->subscription('default');

        if (! $subscription || ! $subscription->onGracePeriod()) {
            throw ValidationException::withMessages([
                'subscription' => ['You do not have a cancelled subscription that can be resumed.'],
            ]);
        }

        try {
            $subscription->resume();

            return response()->json([
                'message' => 'Subscription resumed successfully.',
                'data' => $this->subscriptionService->getSubscriptionStatus($user),
            ]);
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'subscription' => ['Failed to resume subscription: '.$e->getMessage()],
            ]);
        }
    }

    /**
     * Get the current usage vs limits for the subscription.
     */
    public function usage(Request $request): JsonResponse
    {
        $user = $request->user();
        $usage = $this->subscriptionService->getUsage($user);

        return response()->json([
            'data' => $usage,
        ]);
    }
}
