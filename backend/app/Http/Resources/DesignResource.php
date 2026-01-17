<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DesignResource extends JsonResource
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
            'user_id' => $this->user_id,
            'title' => $this->title,
            'description' => $this->description,
            'category' => $this->category,
            'category_label' => $this->getCategoryLabel(),
            'season' => $this->season,
            'season_label' => $this->getSeasonLabel(),
            'target_demographic' => $this->target_demographic,
            'file_path' => $this->file_path,
            'file_url' => $this->file_path ? url('storage/'.$this->file_path) : null,
            'file_type' => $this->file_type,
            'original_filename' => $this->original_filename,
            'file_size' => $this->file_size,
            'file_size_formatted' => $this->formatFileSize(),
            'ai_analysis_status' => $this->ai_analysis_status,
            'ai_analysis_result' => $this->ai_analysis_result,
            'trend_score' => $this->trend_score,
            'status' => $this->status,
            'image_locked' => $this->image_locked ?? false,
            'variations_count' => $this->whenCounted('variations'),
            'variations' => DesignVariationResource::collection($this->whenLoaded('variations')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }

    /**
     * Get human-readable category label.
     */
    private function getCategoryLabel(): string
    {
        return match ($this->category) {
            'tops' => 'Tops',
            'bottoms' => 'Bottoms',
            'dresses' => 'Dresses',
            'outerwear' => 'Outerwear',
            'accessories' => 'Accessories',
            'footwear' => 'Footwear',
            'activewear' => 'Activewear',
            'swimwear' => 'Swimwear',
            default => ucfirst($this->category ?? ''),
        };
    }

    /**
     * Get human-readable season label.
     */
    private function getSeasonLabel(): ?string
    {
        if (! $this->season) {
            return null;
        }

        return match ($this->season) {
            'spring_summer' => 'Spring/Summer',
            'fall_winter' => 'Fall/Winter',
            'resort' => 'Resort',
            'pre_fall' => 'Pre-Fall',
            'year_round' => 'Year-Round',
            default => ucfirst($this->season),
        };
    }

    /**
     * Format file size for display.
     */
    private function formatFileSize(): string
    {
        $bytes = $this->file_size ?? 0;

        if ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2).' MB';
        }

        return number_format($bytes / 1024, 2).' KB';
    }
}
