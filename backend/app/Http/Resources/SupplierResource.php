<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SupplierResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $profile = $this->profile;

        return [
            'id' => $this->id,
            'user_id' => $profile?->user_id,

            // Profile fields
            'company_name' => $profile?->business_name,
            'description' => $profile?->bio,
            'logo_url' => $profile?->profile_image_url,
            'location' => $profile?->location,
            'website_url' => $profile?->website_url,
            'phone' => $profile?->phone,

            // Supplier-specific fields
            'service_type' => $this->service_type,
            'service_type_label' => $this->getServiceTypeLabel(),
            'minimum_order_quantity' => $this->minimum_order_quantity,
            'lead_time_days' => $this->lead_time_days,
            'production_capacity' => $this->production_capacity,
            'response_time_hours' => $this->response_time_hours,
            'specialties' => $this->certifications ?? [],

            // Status flags
            'is_verified' => $this->is_verified,
            'is_featured' => $this->is_featured,
            'has_completed_onboarding' => $profile?->has_completed_onboarding ?? false,

            // Certifications
            'certifications' => SupplierCertificationResource::collection(
                $this->whenLoaded('certificationRecords')
            ),
            'certification_types' => $this->whenLoaded('certificationRecords', function () {
                return $this->certificationRecords->pluck('certification_type')->unique()->values();
            }),

            // Product catalog
            'catalog_items' => ProductCatalogItemResource::collection(
                $this->whenLoaded('productCatalog')
            ),
            'catalog_count' => $this->when(
                $this->relationLoaded('productCatalog'),
                fn () => $this->productCatalog->count()
            ),

            // Match score (if calculated)
            'match_score' => $this->when(isset($this->match_score), $this->match_score),

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }

    /**
     * Get human-readable service type label.
     */
    private function getServiceTypeLabel(): string
    {
        return match ($this->service_type) {
            'fabric' => 'Fabric Supplier',
            'cmt' => 'CMT (Cut, Make, Trim)',
            'full_production' => 'Full Production',
            default => ucfirst($this->service_type ?? ''),
        };
    }
}
