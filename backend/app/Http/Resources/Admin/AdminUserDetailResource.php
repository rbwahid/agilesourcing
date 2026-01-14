<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\Activitylog\Models\Activity;

class AdminUserDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'is_active' => $this->is_active,
            'email_verified_at' => $this->email_verified_at?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
            'last_login_at' => $this->last_login_at?->toIso8601String(),
            'profile' => $this->when($this->profile, fn () => [
                'id' => $this->profile->id,
                'company_name' => $this->profile->company_name,
                'bio' => $this->profile->bio,
                'location' => $this->profile->location,
                'website' => $this->profile->website,
                'avatar_url' => $this->profile->avatar_url,
                'has_completed_onboarding' => $this->profile->has_completed_onboarding,
            ]),
            'subscription' => $this->when($this->subscriptions->isNotEmpty(), fn () => [
                'id' => $this->subscriptions->first()->id,
                'name' => $this->subscriptions->first()->type,
                'stripe_status' => $this->subscriptions->first()->stripe_status,
                'trial_ends_at' => $this->subscriptions->first()->trial_ends_at?->toIso8601String(),
                'ends_at' => $this->subscriptions->first()->ends_at?->toIso8601String(),
                'created_at' => $this->subscriptions->first()->created_at->toIso8601String(),
            ]),
            'recent_activity' => $this->getRecentActivity(),
            'stats' => $this->getUserStats(),
        ];
    }

    /**
     * Get recent activity for this user.
     */
    private function getRecentActivity(): array
    {
        $activities = Activity::where('subject_type', get_class($this->resource))
            ->where('subject_id', $this->id)
            ->latest()
            ->take(10)
            ->get();

        return $activities->map(fn ($activity) => [
            'id' => $activity->id,
            'description' => $activity->description,
            'causer' => $activity->causer ? [
                'id' => $activity->causer->id,
                'name' => $activity->causer->name,
            ] : null,
            'properties' => $activity->properties,
            'created_at' => $activity->created_at->toIso8601String(),
        ])->toArray();
    }

    /**
     * Get user-specific stats.
     */
    private function getUserStats(): array
    {
        $stats = [];

        if ($this->role === 'designer') {
            $stats['designs_count'] = $this->designs()->count();
            $stats['saved_suppliers_count'] = $this->savedSuppliers()->count();
        }

        if ($this->role === 'supplier' && $this->profile?->supplier) {
            $stats['certifications_count'] = $this->profile->supplier->certificationRecords()->count();
            $stats['verified_certifications'] = $this->profile->supplier->certificationRecords()
                ->whereNotNull('verified_at')
                ->count();
        }

        return $stats;
    }
}
