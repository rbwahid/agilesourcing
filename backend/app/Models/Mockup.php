<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Mockup extends Model
{
    use HasFactory;

    protected $fillable = [
        'design_id',
        'design_variation_id',
        'model_type',
        'pose',
        'background',
        'file_path',
        'file_url',
        'generation_prompt',
        'error_message',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Valid model types for mockup generation.
     */
    public const MODEL_TYPES = ['male', 'female', 'unisex'];

    /**
     * Valid poses for mockup generation.
     */
    public const POSES = ['front', 'side', 'back', 'action'];

    /**
     * Valid backgrounds for mockup generation.
     */
    public const BACKGROUNDS = ['studio', 'outdoor', 'urban', 'beach'];

    /**
     * Get the design this mockup belongs to.
     */
    public function design(): BelongsTo
    {
        return $this->belongsTo(Design::class);
    }

    /**
     * Get the design variation this mockup is based on (optional).
     */
    public function designVariation(): BelongsTo
    {
        return $this->belongsTo(DesignVariation::class);
    }

    /**
     * Get validations that use this mockup.
     */
    public function validations(): HasMany
    {
        return $this->hasMany(Validation::class);
    }

    /**
     * Scope to get completed mockups.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope to get pending/processing mockups.
     */
    public function scopeProcessing($query)
    {
        return $query->whereIn('status', ['pending', 'processing']);
    }

    /**
     * Check if mockup generation is complete.
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Check if mockup generation failed.
     */
    public function isFailed(): bool
    {
        return $this->status === 'failed';
    }

    /**
     * Check if mockup is ready to use for validation.
     */
    public function isReadyForValidation(): bool
    {
        return $this->isCompleted() && $this->file_url !== null;
    }

    /**
     * Get the file URL attribute with fallback to private file route.
     */
    public function getFileUrlAttribute($value): ?string
    {
        if ($value) {
            return $value;
        }

        if ($this->file_path && $this->design_id) {
            return route('files.serve', [
                'type' => 'mockups',
                'id' => $this->design_id,
                'filename' => basename($this->file_path),
            ]);
        }

        return null;
    }
}
