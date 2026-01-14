<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class VerificationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'supplier_id' => $this->supplier_id,
            'certification_type' => $this->certification_type,
            'certificate_url' => $this->certificate_path
                ? Storage::url($this->certificate_path)
                : null,
            'expiry_date' => $this->expiry_date?->toDateString(),
            'is_verified' => $this->verified_at !== null,
            'is_expired' => $this->isExpired(),
            'is_expiring_soon' => $this->isExpiringSoon(),
            'verified_at' => $this->verified_at?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
            'supplier' => $this->when($this->relationLoaded('supplier'), fn () => [
                'id' => $this->supplier->id,
                'service_type' => $this->supplier->service_type,
                'is_verified' => $this->supplier->is_verified,
                'profile' => $this->when($this->supplier->relationLoaded('profile'), fn () => [
                    'id' => $this->supplier->profile->id,
                    'company_name' => $this->supplier->profile->company_name,
                    'location' => $this->supplier->profile->location,
                    'user' => $this->when($this->supplier->profile->relationLoaded('user'), fn () => [
                        'id' => $this->supplier->profile->user->id,
                        'name' => $this->supplier->profile->user->name,
                        'email' => $this->supplier->profile->user->email,
                    ]),
                ]),
            ]),
            'verifier' => $this->when($this->relationLoaded('verifier') && $this->verifier, fn () => [
                'id' => $this->verifier->id,
                'name' => $this->verifier->name,
            ]),
        ];
    }
}
