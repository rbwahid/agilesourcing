<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Design extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'category',
        'season',
        'target_demographic',
        'file_path',
        'file_type',
        'original_filename',
        'file_size',
        'ai_analysis_status',
        'ai_analysis_result',
        'trend_score',
        'status',
        'image_locked',
    ];

    protected function casts(): array
    {
        return [
            'ai_analysis_result' => 'array',
            'trend_score' => 'integer',
            'file_size' => 'integer',
            'image_locked' => 'boolean',
        ];
    }

    /**
     * Boot the model and register event listeners.
     */
    protected static function boot()
    {
        parent::boot();

        // Lock image when status changes from draft to any other status
        static::updating(function (Design $design) {
            if ($design->isDirty('status') && $design->getOriginal('status') === 'draft' && $design->status !== 'draft') {
                $design->image_locked = true;
            }
        });
    }

    /**
     * Get the user that owns the design.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the design variations.
     */
    public function variations(): HasMany
    {
        return $this->hasMany(DesignVariation::class);
    }

    /**
     * Get the validations for the design.
     */
    public function validations(): HasMany
    {
        return $this->hasMany(Validation::class);
    }

    /**
     * Get the mockups for the design.
     */
    public function mockups(): HasMany
    {
        return $this->hasMany(Mockup::class);
    }

    /**
     * Get inquiries related to this design.
     */
    public function inquiries(): HasMany
    {
        return $this->hasMany(Inquiry::class);
    }

    /**
     * Scope to get active designs.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope to get designs pending AI analysis.
     */
    public function scopePendingAnalysis($query)
    {
        return $query->where('ai_analysis_status', 'pending');
    }

    /**
     * Check if AI analysis is complete.
     */
    public function isAnalysisComplete(): bool
    {
        return $this->ai_analysis_status === 'completed';
    }

    /**
     * Get the winning validation if exists.
     */
    public function winningValidation()
    {
        return $this->validations()->where('is_winner', true)->first();
    }
}
