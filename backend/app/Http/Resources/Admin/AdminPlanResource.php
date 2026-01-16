<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminPlanResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'user_type' => $this->user_type,
            'price_monthly' => (float) $this->price_monthly,
            'price_annual' => (float) $this->price_annual,
            'features' => $this->features ?? [],
            'design_uploads_limit' => $this->design_uploads_limit,
            'validations_limit' => $this->validations_limit,
            'has_unlimited_uploads' => $this->hasUnlimitedUploads(),
            'has_unlimited_validations' => $this->hasUnlimitedValidations(),
            'is_active' => $this->is_active,
            'stripe_product_id' => $this->stripe_product_id,
            'stripe_price_monthly_id' => $this->stripe_price_monthly_id,
            'stripe_price_annual_id' => $this->stripe_price_annual_id,
            'has_stripe_ids' => $this->hasStripeIds(),
            'subscriber_count' => $this->whenCounted('subscriptions', $this->subscriptions_count ?? 0),
            'active_subscriber_count' => $this->active_subscriber_count,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
