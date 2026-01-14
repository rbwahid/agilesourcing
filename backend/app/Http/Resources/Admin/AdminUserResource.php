<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminUserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'is_active' => $this->is_active,
            'email_verified_at' => $this->email_verified_at?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
            'last_login_at' => $this->last_login_at?->toIso8601String(),
            'subscription_status' => $this->getSubscriptionStatus(),
        ];
    }

    /**
     * Get the subscription status.
     */
    private function getSubscriptionStatus(): string
    {
        if (! $this->resource->relationLoaded('subscriptions')) {
            $this->resource->load('subscriptions');
        }

        $subscription = $this->subscriptions->first();

        if (! $subscription) {
            return 'none';
        }

        return match ($subscription->stripe_status) {
            'active' => 'active',
            'trialing' => 'trialing',
            'canceled', 'cancelled' => 'cancelled',
            default => 'none',
        };
    }
}
