<?php

namespace App\Listeners;

use App\Models\User;
use App\Notifications\PaymentFailedNotification;
use Illuminate\Support\Facades\Log;
use Laravel\Cashier\Events\WebhookReceived;

class StripeEventListener
{
    /**
     * Handle Stripe webhook events.
     */
    public function handle(WebhookReceived $event): void
    {
        $payload = $event->payload;
        $eventType = $payload['type'] ?? null;

        Log::info('Stripe webhook received', [
            'type' => $eventType,
            'id' => $payload['id'] ?? null,
        ]);

        match ($eventType) {
            'invoice.payment_failed' => $this->handlePaymentFailed($payload),
            'customer.subscription.deleted' => $this->handleSubscriptionDeleted($payload),
            'customer.subscription.updated' => $this->handleSubscriptionUpdated($payload),
            default => null,
        };
    }

    /**
     * Handle failed payment event.
     */
    private function handlePaymentFailed(array $payload): void
    {
        $invoice = $payload['data']['object'] ?? null;

        if (! $invoice) {
            return;
        }

        $customerId = $invoice['customer'] ?? null;

        if (! $customerId) {
            return;
        }

        $user = User::where('stripe_id', $customerId)->first();

        if (! $user) {
            Log::warning('Payment failed for unknown customer', ['stripe_id' => $customerId]);

            return;
        }

        // Send notification to user
        $user->notify(new PaymentFailedNotification(
            invoiceId: $invoice['id'],
            amount: $invoice['amount_due'] ?? 0,
            currency: $invoice['currency'] ?? 'usd'
        ));

        Log::info('Payment failed notification sent', [
            'user_id' => $user->id,
            'invoice_id' => $invoice['id'],
        ]);
    }

    /**
     * Handle subscription deleted event.
     */
    private function handleSubscriptionDeleted(array $payload): void
    {
        $subscription = $payload['data']['object'] ?? null;

        if (! $subscription) {
            return;
        }

        $customerId = $subscription['customer'] ?? null;

        if (! $customerId) {
            return;
        }

        $user = User::where('stripe_id', $customerId)->first();

        if ($user) {
            Log::info('Subscription deleted', [
                'user_id' => $user->id,
                'subscription_id' => $subscription['id'],
            ]);
        }
    }

    /**
     * Handle subscription updated event.
     */
    private function handleSubscriptionUpdated(array $payload): void
    {
        $subscription = $payload['data']['object'] ?? null;

        if (! $subscription) {
            return;
        }

        $customerId = $subscription['customer'] ?? null;
        $status = $subscription['status'] ?? null;

        if (! $customerId) {
            return;
        }

        $user = User::where('stripe_id', $customerId)->first();

        if ($user) {
            Log::info('Subscription updated', [
                'user_id' => $user->id,
                'subscription_id' => $subscription['id'],
                'status' => $status,
            ]);
        }
    }
}
