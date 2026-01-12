<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DesignVariationResource extends JsonResource
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
            'design_id' => $this->design_id,
            'variation_number' => $this->variation_number,
            'description' => $this->description,
            'file_path' => $this->file_path,
            'file_url' => $this->file_path ? url('storage/'.$this->file_path) : null,
            'ai_suggestions' => $this->ai_suggestions,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
