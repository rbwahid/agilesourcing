<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SupplierProfileView extends Model
{
    use HasFactory;

    protected $fillable = [
        'supplier_id',
        'viewer_id',
        'viewer_ip',
        'viewer_user_agent',
    ];

    /**
     * Get the supplier whose profile was viewed.
     */
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'supplier_id');
    }

    /**
     * Get the user who viewed the profile.
     */
    public function viewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'viewer_id');
    }

    /**
     * Scope to get views for a specific supplier.
     */
    public function scopeForSupplier($query, int $supplierId)
    {
        return $query->where('supplier_id', $supplierId);
    }

    /**
     * Scope to get views within a date range.
     */
    public function scopeInDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }

    /**
     * Scope to get unique views (by viewer_id or IP if anonymous).
     */
    public function scopeUniqueViewers($query)
    {
        return $query->select('supplier_id')
            ->selectRaw('COALESCE(viewer_id, viewer_ip) as viewer_identifier')
            ->groupBy('supplier_id', 'viewer_identifier');
    }
}
