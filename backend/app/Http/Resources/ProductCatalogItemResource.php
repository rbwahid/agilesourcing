<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductCatalogItemResource extends JsonResource
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
            'name' => $this->name,
            'description' => $this->description,
            'category' => $this->category,
            'images' => $this->getImageUrls(),
            'primary_image' => $this->getPrimaryImageUrl(),
            'specifications' => $this->specifications ?? [],
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }

    /**
     * Get full URLs for all images.
     */
    private function getImageUrls(): array
    {
        $images = $this->images ?? [];

        return array_map(function ($path) {
            return url('storage/'.$path);
        }, $images);
    }

    /**
     * Get primary image URL.
     */
    private function getPrimaryImageUrl(): ?string
    {
        $images = $this->images ?? [];

        if (empty($images)) {
            return null;
        }

        return url('storage/'.$images[0]);
    }
}
