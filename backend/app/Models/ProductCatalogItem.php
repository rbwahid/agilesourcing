<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductCatalogItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'supplier_id',
        'name',
        'description',
        'category',
        'images',
        'specifications',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'images' => 'array',
            'specifications' => 'array',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the supplier that owns the product.
     */
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    /**
     * Scope to get active products.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get primary image URL.
     */
    public function getPrimaryImageAttribute(): ?string
    {
        return $this->images[0] ?? null;
    }
}
