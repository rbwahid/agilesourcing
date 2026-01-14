<?php

namespace App\Http\Resources\Admin;

use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminSubscriptionDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        $plan = $this->resolvePlan();
        $billingPeriod = $this->determineBillingPeriod();
        $amount = $this->calculateMonthlyAmount($plan, $billingPeriod);
        $invoices = $this->getInvoices();

        return [
            'id' => $this->id,
            'stripe_id' => $this->stripe_id,
            'stripe_status' => $this->stripe_status,
            'stripe_price' => $this->stripe_price,
            'billing_period' => $billingPeriod,
            'trial_ends_at' => $this->trial_ends_at?->toIso8601String(),
            'ends_at' => $this->ends_at?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
            'on_trial' => $this->onTrial(),
            'on_grace_period' => $this->onGracePeriod(),
            'cancelled' => $this->cancelled(),
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
                'role' => $this->user->role,
                'is_active' => $this->user->is_active,
                'created_at' => $this->user->created_at->toIso8601String(),
            ],
            'plan' => $plan ? [
                'id' => $plan->id,
                'name' => $plan->name,
                'slug' => $plan->slug,
                'price_monthly' => (float) $plan->price_monthly,
                'price_annual' => (float) $plan->price_annual,
            ] : null,
            'amount' => $amount,
            'invoices' => $invoices,
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
            return (int) round(($plan->price_annual / 12) * 100);
        }

        return (int) ($plan->price_monthly * 100);
    }

    /**
     * Get recent invoices for this subscription's user.
     */
    private function getInvoices(): array
    {
        try {
            if (! $this->user->stripe_id) {
                return [];
            }

            $invoices = $this->user->invoices()->take(10);

            return $invoices->map(function ($invoice) {
                return [
                    'id' => $invoice->id,
                    'number' => $invoice->number,
                    'amount_due' => $invoice->rawAmountDue(),
                    'amount_paid' => $invoice->rawAmountPaid(),
                    'currency' => $invoice->currency,
                    'status' => $invoice->status,
                    'created' => $invoice->date()->toIso8601String(),
                    'invoice_pdf' => $invoice->invoicePdf(),
                    'hosted_invoice_url' => $invoice->hostedInvoiceUrl(),
                ];
            })->toArray();
        } catch (\Exception $e) {
            return [];
        }
    }
}
