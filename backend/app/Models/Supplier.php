<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supplier extends Model
{
    use HasFactory;

    protected $fillable = [
        'profile_id',
        'service_type',
        'minimum_order_quantity',
        'lead_time_days',
        'production_capacity',
        'certifications',
        'is_verified',
        'is_featured',
        'response_time_hours',
    ];

    protected function casts(): array
    {
        return [
            'certifications' => 'array',
            'minimum_order_quantity' => 'integer',
            'lead_time_days' => 'integer',
            'production_capacity' => 'integer',
            'response_time_hours' => 'integer',
            'is_verified' => 'boolean',
            'is_featured' => 'boolean',
        ];
    }

    /**
     * Get the profile that owns the supplier.
     */
    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }

    /**
     * Get the supplier's certifications.
     */
    public function certificationRecords(): HasMany
    {
        return $this->hasMany(SupplierCertification::class);
    }

    /**
     * Get the supplier's product catalog.
     */
    public function productCatalog(): HasMany
    {
        return $this->hasMany(ProductCatalogItem::class);
    }

    /**
     * Get designers who saved this supplier.
     */
    public function savedByUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'saved_suppliers')
            ->withTimestamps();
    }

    /**
     * Scope to get verified suppliers.
     */
    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    /**
     * Scope to get featured suppliers.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Get user through profile.
     */
    public function user()
    {
        return $this->profile->user;
    }
}
