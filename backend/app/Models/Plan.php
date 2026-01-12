<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'user_type',
        'price_monthly',
        'price_annual',
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
}
