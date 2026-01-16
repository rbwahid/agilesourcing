<?php

namespace App\Services;

use App\Models\Plan;
use Stripe\Price;
use Stripe\Product;
use Stripe\Stripe;

class PlanService
{
    public function __construct()
    {
        Stripe::setApiKey(config('cashier.secret'));
    }

    /**
     * Update a plan with the given data.
     */
    public function updatePlan(Plan $plan, array $data): Plan
    {
        $plan->update($data);

        return $plan->fresh();
    }

    /**
     * Sync a plan with Stripe (create or update product and prices).
     */
    public function syncWithStripe(Plan $plan): array
    {
        // Create or update the Stripe product
        $product = $this->syncProduct($plan);

        // Create new prices (Stripe prices are immutable, so we always create new ones)
        $monthlyPrice = $this->createPrice($plan, $product->id, 'monthly');
        $annualPrice = $this->createPrice($plan, $product->id, 'annual');

        // Update plan with Stripe IDs
        $plan->update([
            'stripe_product_id' => $product->id,
            'stripe_price_monthly_id' => $monthlyPrice->id,
            'stripe_price_annual_id' => $annualPrice->id,
        ]);

        return [
            'product_id' => $product->id,
            'price_monthly_id' => $monthlyPrice->id,
            'price_annual_id' => $annualPrice->id,
        ];
    }

    /**
     * Create or update a Stripe product for the plan.
     */
    private function syncProduct(Plan $plan): Product
    {
        $productData = [
            'name' => $plan->name,
            'description' => $this->generateProductDescription($plan),
            'metadata' => [
                'plan_id' => $plan->id,
                'plan_slug' => $plan->slug,
                'user_type' => $plan->user_type,
            ],
        ];

        if ($plan->stripe_product_id) {
            // Update existing product
            return Product::update($plan->stripe_product_id, $productData);
        }

        // Create new product
        return Product::create($productData);
    }

    /**
     * Create a Stripe price for the plan.
     */
    private function createPrice(Plan $plan, string $productId, string $interval): Price
    {
        $amount = $interval === 'annual'
            ? (int) ($plan->price_annual * 100)
            : (int) ($plan->price_monthly * 100);

        $intervalConfig = $interval === 'annual'
            ? ['interval' => 'year', 'interval_count' => 1]
            : ['interval' => 'month', 'interval_count' => 1];

        // Archive old price if exists
        $oldPriceId = $interval === 'annual'
            ? $plan->stripe_price_annual_id
            : $plan->stripe_price_monthly_id;

        if ($oldPriceId) {
            try {
                Price::update($oldPriceId, ['active' => false]);
            } catch (\Exception $e) {
                // Price might not exist or already archived
            }
        }

        return Price::create([
            'product' => $productId,
            'unit_amount' => $amount,
            'currency' => 'cad',
            'recurring' => $intervalConfig,
            'metadata' => [
                'plan_id' => $plan->id,
                'plan_slug' => $plan->slug,
                'billing_period' => $interval,
            ],
        ]);
    }

    /**
     * Generate a product description from plan features.
     */
    private function generateProductDescription(Plan $plan): string
    {
        $features = $plan->features ?? [];
        $enabledFeatures = array_keys(array_filter($features));

        if (empty($enabledFeatures)) {
            return "AgileSourcing {$plan->name} subscription plan.";
        }

        $featureList = array_map(function ($feature) {
            return ucwords(str_replace('_', ' ', $feature));
        }, array_slice($enabledFeatures, 0, 5));

        return "AgileSourcing {$plan->name}: ".implode(', ', $featureList).'.';
    }
}
