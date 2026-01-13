<?php

namespace App\Services\Supplier;

use App\Models\Design;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;

class SupplierMatchingService
{
    /**
     * Weight configuration for matching algorithm.
     */
    private const WEIGHTS = [
        'service_type' => 30,
        'certifications' => 25,
        'moq' => 20,
        'lead_time' => 15,
        'location' => 10,
    ];

    /**
     * Get recommended suppliers for a designer.
     *
     * @param  User  $designer
     * @param  int  $limit
     * @return Collection
     */
    public function getRecommendations(User $designer, int $limit = 10): Collection
    {
        $cacheKey = "supplier_recommendations:user:{$designer->id}";

        return Cache::remember($cacheKey, now()->addMinutes(30), function () use ($designer, $limit) {
            $preferences = $this->extractDesignerPreferences($designer);

            $suppliers = Supplier::query()
                ->with(['profile', 'certificationRecords'])
                ->where('is_verified', true)
                ->whereHas('profile', function ($q) {
                    $q->whereNotNull('onboarding_completed_at');
                })
                ->get();

            // Calculate match scores and sort
            $scoredSuppliers = $suppliers->map(function ($supplier) use ($preferences) {
                $supplier->match_score = $this->calculateMatchScore($supplier, $preferences);

                return $supplier;
            })->sortByDesc('match_score');

            return $scoredSuppliers->take($limit)->values();
        });
    }

    /**
     * Calculate match score between a supplier and designer preferences.
     *
     * @param  Supplier  $supplier
     * @param  array  $preferences
     * @return int
     */
    public function calculateMatchScore(Supplier $supplier, array $preferences): int
    {
        $score = 0;

        // Service type match (30 points)
        if (! empty($preferences['preferred_service_types'])) {
            if (in_array($supplier->service_type, $preferences['preferred_service_types'])) {
                $score += self::WEIGHTS['service_type'];
            }
        } else {
            // Give half points if no preference specified
            $score += self::WEIGHTS['service_type'] / 2;
        }

        // Certification match (25 points)
        if (! empty($preferences['required_certifications'])) {
            $supplierCerts = $supplier->certificationRecords->pluck('certification_type')->toArray();
            $matchedCerts = array_intersect($supplierCerts, $preferences['required_certifications']);
            $certRatio = count($matchedCerts) / count($preferences['required_certifications']);
            $score += self::WEIGHTS['certifications'] * $certRatio;
        } else {
            // Bonus for having any certifications
            if ($supplier->certificationRecords->count() > 0) {
                $score += self::WEIGHTS['certifications'] * 0.5;
            }
        }

        // MOQ compatibility (20 points)
        if (! empty($preferences['typical_order_size']) && $supplier->minimum_order_quantity) {
            if ($supplier->minimum_order_quantity <= $preferences['typical_order_size']) {
                $score += self::WEIGHTS['moq'];
            } else {
                // Partial score based on how close they are
                $moqRatio = $preferences['typical_order_size'] / $supplier->minimum_order_quantity;
                $score += self::WEIGHTS['moq'] * min($moqRatio, 1);
            }
        } else {
            // Give half points if MOQ not specified
            $score += self::WEIGHTS['moq'] / 2;
        }

        // Lead time (15 points)
        if (! empty($preferences['max_lead_time_days']) && $supplier->lead_time_days) {
            if ($supplier->lead_time_days <= $preferences['max_lead_time_days']) {
                $score += self::WEIGHTS['lead_time'];
            } else {
                // Partial score
                $timeRatio = $preferences['max_lead_time_days'] / $supplier->lead_time_days;
                $score += self::WEIGHTS['lead_time'] * min($timeRatio, 1);
            }
        } else {
            $score += self::WEIGHTS['lead_time'] / 2;
        }

        // Location match (10 points)
        if (! empty($preferences['preferred_location']) && $supplier->profile) {
            if (stripos($supplier->profile->location, $preferences['preferred_location']) !== false) {
                $score += self::WEIGHTS['location'];
            }
        }

        return (int) round($score);
    }

    /**
     * Extract designer preferences from their profile and designs.
     *
     * @param  User  $designer
     * @return array
     */
    private function extractDesignerPreferences(User $designer): array
    {
        $preferences = [
            'preferred_service_types' => [],
            'required_certifications' => [],
            'typical_order_size' => null,
            'max_lead_time_days' => null,
            'preferred_location' => null,
        ];

        // Get profile preferences if available
        $profile = $designer->profile;
        if ($profile) {
            // Extract preferences from profile's style_focus or target_demographics
            // These could be extended in the future
        }

        // Analyze recent designs to infer preferences
        $recentDesigns = Design::where('user_id', $designer->id)
            ->where('status', 'active')
            ->latest()
            ->limit(10)
            ->get();

        if ($recentDesigns->isNotEmpty()) {
            // Analyze design categories to suggest service types
            $categories = $recentDesigns->pluck('category')->filter()->unique();

            // Map categories to likely service needs
            $complexCategories = ['outerwear', 'dresses', 'activewear'];
            $simpleCategories = ['accessories'];

            $hasComplex = $categories->intersect($complexCategories)->isNotEmpty();
            $hasSimple = $categories->intersect($simpleCategories)->isNotEmpty();

            if ($hasComplex) {
                $preferences['preferred_service_types'][] = 'full_production';
                $preferences['preferred_service_types'][] = 'cmt';
            }
            if ($hasSimple) {
                $preferences['preferred_service_types'][] = 'fabric';
            }

            // Default to all types if nothing specific found
            if (empty($preferences['preferred_service_types'])) {
                $preferences['preferred_service_types'] = ['fabric', 'cmt', 'full_production'];
            }
        }

        return $preferences;
    }

    /**
     * Get supplier recommendations for a specific design.
     *
     * @param  Design  $design
     * @param  int  $limit
     * @return Collection
     */
    public function getRecommendationsForDesign(Design $design, int $limit = 5): Collection
    {
        $preferences = [
            'preferred_service_types' => ['cmt', 'full_production'],
            'required_certifications' => [],
            'typical_order_size' => null,
            'max_lead_time_days' => null,
            'preferred_location' => null,
        ];

        // Adjust based on design category
        if (in_array($design->category, ['outerwear', 'dresses'])) {
            $preferences['preferred_service_types'] = ['full_production'];
        } elseif ($design->category === 'accessories') {
            $preferences['preferred_service_types'] = ['cmt', 'fabric'];
        }

        $suppliers = Supplier::query()
            ->with(['profile', 'certificationRecords'])
            ->where('is_verified', true)
            ->whereHas('profile', function ($q) {
                $q->whereNotNull('onboarding_completed_at');
            })
            ->get();

        $scoredSuppliers = $suppliers->map(function ($supplier) use ($preferences) {
            $supplier->match_score = $this->calculateMatchScore($supplier, $preferences);

            return $supplier;
        })->sortByDesc('match_score');

        return $scoredSuppliers->take($limit)->values();
    }

    /**
     * Clear recommendation cache for a user.
     *
     * @param  int  $userId
     */
    public function clearRecommendationCache(int $userId): void
    {
        Cache::forget("supplier_recommendations:user:{$userId}");
    }
}
