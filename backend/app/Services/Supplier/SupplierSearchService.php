<?php

namespace App\Services\Supplier;

use App\Models\Supplier;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Cache;

class SupplierSearchService
{
    /**
     * Search suppliers with filters.
     *
     * @param  array  $filters  Search and filter parameters
     * @return LengthAwarePaginator
     */
    public function search(array $filters): LengthAwarePaginator
    {
        $query = Supplier::query()
            ->with(['profile', 'certificationRecords'])
            ->whereHas('profile', function ($q) {
                $q->whereNotNull('onboarding_completed_at');
            });

        // Apply text search
        if (! empty($filters['query'])) {
            $searchTerm = $filters['query'];
            $query->where(function (Builder $q) use ($searchTerm) {
                $q->whereHas('profile', function ($profileQuery) use ($searchTerm) {
                    $profileQuery->where('business_name', 'LIKE', "%{$searchTerm}%")
                        ->orWhere('bio', 'LIKE', "%{$searchTerm}%")
                        ->orWhere('location', 'LIKE', "%{$searchTerm}%");
                });
            });
        }

        // Filter by service type
        if (! empty($filters['service_type'])) {
            $query->where('service_type', $filters['service_type']);
        }

        // Filter by certifications
        if (! empty($filters['certifications']) && is_array($filters['certifications'])) {
            $query->whereHas('certificationRecords', function ($q) use ($filters) {
                $q->whereIn('certification_type', $filters['certifications']);
            });
        }

        // Filter by location
        if (! empty($filters['location'])) {
            $query->whereHas('profile', function ($q) use ($filters) {
                $q->where('location', 'LIKE', "%{$filters['location']}%");
            });
        }

        // Filter by MOQ range
        if (! empty($filters['min_moq'])) {
            $query->where(function ($q) use ($filters) {
                $q->whereNull('minimum_order_quantity')
                    ->orWhere('minimum_order_quantity', '>=', $filters['min_moq']);
            });
        }

        if (! empty($filters['max_moq'])) {
            $query->where(function ($q) use ($filters) {
                $q->whereNull('minimum_order_quantity')
                    ->orWhere('minimum_order_quantity', '<=', $filters['max_moq']);
            });
        }

        // Filter by verified status
        if (isset($filters['is_verified']) && $filters['is_verified'] !== null) {
            $query->where('is_verified', $filters['is_verified']);
        }

        // Apply sorting
        $sortBy = $filters['sort_by'] ?? 'newest';
        $this->applySorting($query, $sortBy);

        $perPage = $filters['per_page'] ?? 12;

        return $query->paginate($perPage);
    }

    /**
     * Get featured suppliers.
     *
     * @param  int  $limit
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getFeatured(int $limit = 6)
    {
        $cacheKey = "suppliers:featured:{$limit}";

        return Cache::remember($cacheKey, now()->addHours(1), function () use ($limit) {
            return Supplier::query()
                ->with(['profile', 'certificationRecords'])
                ->where('is_featured', true)
                ->where('is_verified', true)
                ->whereHas('profile', function ($q) {
                    $q->whereNotNull('onboarding_completed_at');
                })
                ->inRandomOrder()
                ->limit($limit)
                ->get();
        });
    }

    /**
     * Apply sorting to query.
     */
    private function applySorting(Builder $query, string $sortBy): void
    {
        switch ($sortBy) {
            case 'lead_time':
                $query->orderBy('lead_time_days', 'asc');
                break;

            case 'moq':
                $query->orderByRaw('COALESCE(minimum_order_quantity, 999999) ASC');
                break;

            case 'rating':
                // For now, prioritize verified suppliers
                // Can be extended when reviews are implemented
                $query->orderBy('is_verified', 'desc')
                    ->orderBy('is_featured', 'desc');
                break;

            case 'relevance':
                // Relevance ordering based on completeness and verification
                $query->orderBy('is_verified', 'desc')
                    ->orderBy('is_featured', 'desc')
                    ->orderBy('created_at', 'desc');
                break;

            case 'newest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }
    }

    /**
     * Get supplier by ID with all relations.
     *
     * @param  int  $supplierId
     * @return Supplier|null
     */
    public function getSupplierWithDetails(int $supplierId): ?Supplier
    {
        return Supplier::query()
            ->with([
                'profile',
                'certificationRecords',
                'productCatalog' => function ($q) {
                    $q->where('is_active', true);
                },
            ])
            ->find($supplierId);
    }
}
