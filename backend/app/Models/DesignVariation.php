<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DesignVariation extends Model
{
    use HasFactory;

    protected $fillable = [
        'design_id',
        'variation_number',
        'description',
        'file_path',
        'ai_suggestions',
    ];

    protected function casts(): array
    {
        return [
            'ai_suggestions' => 'array',
            'variation_number' => 'integer',
        ];
    }

    /**
     * Get the design that owns the variation.
     */
    public function design(): BelongsTo
    {
        return $this->belongsTo(Design::class);
    }

    /**
     * Get validations for this variation.
     */
    public function validations(): HasMany
    {
        return $this->hasMany(Validation::class, 'variation_id');
    }
}
