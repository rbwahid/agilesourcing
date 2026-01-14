<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
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
            'type' => $this->type,
            'business_name' => $this->business_name,
            'location' => $this->location,
            'bio' => $this->bio,
            'profile_image_path' => $this->profile_image_path,
            'profile_image_url' => $this->profile_image_path
                ? url('storage/'.$this->profile_image_path)
                : null,
            'website_url' => $this->website_url,
            'phone' => $this->phone,
            'style_focus' => $this->style_focus ?? [],
            'target_demographics' => $this->target_demographics ?? [],
            'verification_status' => $this->verification_status,
            'is_verified' => $this->isVerified(),
            'onboarding_completed_at' => $this->onboarding_completed_at?->toISOString(),
            'has_completed_onboarding' => $this->hasCompletedOnboarding(),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
