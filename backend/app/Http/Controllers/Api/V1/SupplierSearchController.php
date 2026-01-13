<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\SupplierSearchRequest;
use App\Http\Resources\SupplierResource;
use App\Services\Supplier\SupplierMatchingService;
use App\Services\Supplier\SupplierSearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SupplierSearchController extends Controller
{
    public function __construct(
        private SupplierSearchService $searchService,
        private SupplierMatchingService $matchingService
    ) {}

    /**
     * Get paginated list of suppliers with filters.
     */
    public function index(SupplierSearchRequest $request): AnonymousResourceCollection
    {
        $suppliers = $this->searchService->search($request->validated());

        return SupplierResource::collection($suppliers);
    }

    /**
     * Get featured suppliers.
     */
    public function featured(Request $request): JsonResponse
    {
        $limit = $request->input('limit', 6);
        $suppliers = $this->searchService->getFeatured($limit);

        return response()->json([
            'data' => SupplierResource::collection($suppliers),
        ]);
    }

    /**
     * Get personalized supplier recommendations for the authenticated designer.
     */
    public function recommendations(Request $request): JsonResponse
    {
        $user = $request->user();

        // Only designers can get recommendations
        if ($user->role !== 'designer') {
            return response()->json([
                'message' => 'Recommendations are only available for designers.',
            ], 403);
        }

        $limit = $request->input('limit', 10);
        $suppliers = $this->matchingService->getRecommendations($user, $limit);

        return response()->json([
            'data' => SupplierResource::collection($suppliers),
        ]);
    }
}
