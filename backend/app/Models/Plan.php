<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Cashier\Subscription;

class Plan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'user_type',
        'price_monthly',
        'price_annual',
        'stripe_price_monthly_id',
        'stripe_price_annual_id',
        'stripe_product_id',
        'features',
        'design_uploads_limit',
        'validations_limit',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price_monthly' => 'decimal:2',
            'price_annual' => 'decimal:2',
            'features' => 'array',
            'design_uploads_limit' => 'integer',
            'validations_limit' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Scope to get only active plans.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get plans for designers.
     */
    public function scopeForDesigners($query)
    {
        return $query->where('user_type', 'designer');
    }

    /**
     * Scope to get plans for suppliers.
     */
    public function scopeForSuppliers($query)
    {
        return $query->where('user_type', 'supplier');
    }

    /**
     * Check if plan has unlimited uploads.
     */
    public function hasUnlimitedUploads(): bool
    {
        return $this->design_uploads_limit === null;
    }

    /**
     * Check if plan has unlimited validations.
     */
    public function hasUnlimitedValidations(): bool
    {
        return $this->validations_limit === null;
    }

    /**
     * Get the Stripe price ID for the given billing period.
     */
    public function getStripePriceId(string $billingPeriod): ?string
    {
        return $billingPeriod === 'annual'
            ? $this->stripe_price_annual_id
            : $this->stripe_price_monthly_id;
    }

    /**
     * Get the price for the given billing period.
     */
    public function getPriceForPeriod(string $billingPeriod): float
    {
        return $billingPeriod === 'annual'
            ? (float) $this->price_annual
            : (float) $this->price_monthly;
    }

    /**
     * Get subscriptions using this plan's Stripe price IDs.
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class, 'stripe_price', 'stripe_price_monthly_id')
            ->orWhere('stripe_price', $this->stripe_price_annual_id);
    }

    /**
     * Get count of active subscriptions for this plan.
     */
    public function getActiveSubscriberCountAttribute(): int
    {
        return Subscription::where('stripe_status', 'active')
            ->where(function ($query) {
                $query->where('stripe_price', $this->stripe_price_monthly_id)
                    ->orWhere('stripe_price', $this->stripe_price_annual_id);
            })
            ->count();
    }

    /**
     * Check if plan has Stripe IDs configured.
     */
    public function hasStripeIds(): bool
    {
        return $this->stripe_product_id !== null
            && $this->stripe_price_monthly_id !== null
            && $this->stripe_price_annual_id !== null;
    }
}
