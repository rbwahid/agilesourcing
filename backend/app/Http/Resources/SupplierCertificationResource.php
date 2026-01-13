<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SupplierCertificationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'supplier_id' => $this->supplier_id,
            'certification_type' => $this->certification_type,
            'certification_label' => $this->getCertificationLabel(),
            'certificate_url' => $this->certificate_path
                ? url('storage/'.$this->certificate_path)
                : null,
            'expiry_date' => $this->expiry_date?->toDateString(),
            'is_verified' => $this->isVerified(),
            'verified_at' => $this->verified_at?->toISOString(),
            'is_expired' => $this->isExpired(),
            'is_expiring_soon' => $this->isExpiringSoon(),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }

    /**
     * Get human-readable certification label.
     */
    private function getCertificationLabel(): string
    {
        return match ($this->certification_type) {
            'GOTS' => 'GOTS (Global Organic Textile Standard)',
            'OEKO_TEX' => 'OEKO-TEX Standard 100',
            'FAIR_TRADE' => 'Fair Trade Certified',
            'ISO_9001' => 'ISO 9001 (Quality Management)',
            'ISO_14001' => 'ISO 14001 (Environmental Management)',
            'WRAP' => 'WRAP (Worldwide Responsible Accredited Production)',
            'BSCI' => 'BSCI (Business Social Compliance)',
            'SA8000' => 'SA8000 (Social Accountability)',
            default => $this->certification_type,
        };
    }
}
