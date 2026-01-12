<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Validation extends Model
{
    use HasFactory;

    protected $fillable = [
        'design_id',
        'variation_id',
        'instagram_connection_id',
        'mockup_id',
        'instagram_post_id',
        'instagram_post_url',
        'caption',
        'validation_duration_hours',
        'posted_at',
        'validation_ends_at',
        'status',
        'likes_count',
        'comments_count',
        'shares_count',
        'saves_count',
        'engagement_rate',
        'validation_score',
        'hourly_metrics',
        'is_winner',
    ];

    /**
     * Valid validation durations in hours.
     */
    public const DURATIONS = [24, 48, 72, 168]; // 24h, 48h, 72h, 7d

    protected function casts(): array
    {
        return [
            'posted_at' => 'datetime',
            'validation_ends_at' => 'datetime',
            'validation_duration_hours' => 'integer',
            'likes_count' => 'integer',
            'comments_count' => 'integer',
            'shares_count' => 'integer',
            'saves_count' => 'integer',
            'engagement_rate' => 'decimal:4',
            'validation_score' => 'integer',
            'hourly_metrics' => 'array',
            'is_winner' => 'boolean',
        ];
    }

    /**
     * Get the design being validated.
     */
    public function design(): BelongsTo
    {
        return $this->belongsTo(Design::class);
    }

    /**
     * Get the variation being validated (null if original).
     */
    public function variation(): BelongsTo
    {
        return $this->belongsTo(DesignVariation::class, 'variation_id');
    }

    /**
     * Get the Instagram connection used.
     */
    public function instagramConnection(): BelongsTo
    {
        return $this->belongsTo(InstagramConnection::class);
    }

    /**
     * Get the mockup used for this validation.
     */
    public function mockup(): BelongsTo
    {
        return $this->belongsTo(Mockup::class);
    }

    /**
     * Scope to get pending validations.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope to get active validations.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope to get completed validations.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Check if validation is pending (not yet posted).
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if validation is active (posted and collecting metrics).
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if validation is for the original design.
     */
    public function isOriginal(): bool
    {
        return $this->variation_id === null;
    }

    /**
     * Get total engagement count.
     */
    public function getTotalEngagementAttribute(): int
    {
        return $this->likes_count + $this->comments_count + $this->shares_count + $this->saves_count;
    }

    /**
     * Check if validation period has ended.
     */
    public function hasEnded(): bool
    {
        return $this->validation_ends_at !== null && $this->validation_ends_at->isPast();
    }

    /**
     * Get time remaining until validation ends.
     */
    public function getTimeRemainingAttribute(): ?string
    {
        if ($this->validation_ends_at === null) {
            return null;
        }

        if ($this->hasEnded()) {
            return 'Completed';
        }

        return $this->validation_ends_at->diffForHumans();
    }

    /**
     * Append hourly metric to the tracking array.
     */
    public function appendHourlyMetric(array $metric): void
    {
        $metrics = $this->hourly_metrics ?? [];
        $metrics[] = array_merge(['timestamp' => now()->toISOString()], $metric);
        $this->hourly_metrics = $metrics;
        $this->save();
    }
}
