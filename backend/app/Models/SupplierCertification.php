<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SupplierCertification extends Model
{
    use HasFactory;

    protected $fillable = [
        'supplier_id',
        'certification_type',
        'certificate_path',
        'expiry_date',
        'verified_at',
        'verified_by',
    ];

    protected function casts(): array
    {
        return [
            'expiry_date' => 'date',
            'verified_at' => 'datetime',
        ];
    }

    /**
     * Get the supplier that owns the certification.
     */
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    /**
     * Get the admin who verified this certification.
     */
    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /**
     * Check if the certification is verified.
     */
    public function isVerified(): bool
    {
        return $this->verified_at !== null;
    }

    /**
     * Check if the certification is expired.
     */
    public function isExpired(): bool
    {
        return $this->expiry_date !== null && $this->expiry_date->isPast();
    }

    /**
     * Check if certification expires soon (within 30 days).
     */
    public function isExpiringSoon(): bool
    {
        return $this->expiry_date !== null && $this->expiry_date->isBefore(now()->addDays(30));
    }
}
