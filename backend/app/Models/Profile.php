<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'business_name',
        'location',
        'bio',
        'profile_image_path',
        'website_url',
        'phone',
        'style_focus',
        'target_demographics',
        'verification_status',
        'verification_submitted_at',
        'onboarding_completed_at',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<string>
     */
    protected $appends = [
        'has_completed_onboarding',
        'is_verified',
        'profile_image_url',
    ];

    protected function casts(): array
    {
        return [
            'style_focus' => 'array',
            'target_demographics' => 'array',
            'verification_submitted_at' => 'datetime',
            'onboarding_completed_at' => 'datetime',
        ];
    }

    /**
     * Get the user that owns the profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the supplier record if this is a supplier profile.
     */
    public function supplier(): HasOne
    {
        return $this->hasOne(Supplier::class);
    }

    /**
     * Check if profile is verified.
     */
    public function isVerified(): bool
    {
        return $this->verification_status === 'verified';
    }

    /**
     * Check if onboarding is complete.
     */
    public function hasCompletedOnboarding(): bool
    {
        return $this->onboarding_completed_at !== null;
    }

    /**
     * Get the is_verified attribute.
     */
    public function getIsVerifiedAttribute(): bool
    {
        return $this->isVerified();
    }

    /**
     * Get the has_completed_onboarding attribute.
     */
    public function getHasCompletedOnboardingAttribute(): bool
    {
        return $this->hasCompletedOnboarding();
    }

    /**
     * Get the profile_image_url attribute.
     */
    public function getProfileImageUrlAttribute(): ?string
    {
        return $this->profile_image_path
            ? url('storage/' . $this->profile_image_path)
            : null;
    }
}
