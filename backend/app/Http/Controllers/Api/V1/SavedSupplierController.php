<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\SupplierResource;
use App\Models\Supplier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SavedSupplierController extends Controller
{
    /**
     * Get the authenticated designer's saved suppliers.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();

        $savedSuppliers = $user->savedSuppliers()
            ->with(['profile', 'certificationRecords'])
            ->orderByPivot('created_at', 'desc')
            ->get();

        return SupplierResource::collection($savedSuppliers);
    }

    /**
     * Save a supplier to the designer's list.
     */
    public function store(Request $request, Supplier $supplier): JsonResponse
    {
        $user = $request->user();

        // Check if already saved
        if ($user->savedSuppliers()->where('supplier_id', $supplier->id)->exists()) {
            return response()->json([
                'message' => 'Supplier is already saved.',
            ], 422);
        }

        $user->savedSuppliers()->attach($supplier->id);

        return response()->json([
            'message' => 'Supplier saved successfully.',
        ], 201);
    }

    /**
     * Remove a supplier from the designer's saved list.
     */
    public function destroy(Request $request, Supplier $supplier): JsonResponse
    {
        $user = $request->user();

        $user->savedSuppliers()->detach($supplier->id);

        return response()->json([
            'message' => 'Supplier removed from saved list.',
        ]);
    }

    /**
     * Check if a supplier is saved by the current user.
     */
    public function check(Request $request, Supplier $supplier): JsonResponse
    {
        $user = $request->user();

        $isSaved = $user->savedSuppliers()
            ->where('supplier_id', $supplier->id)
            ->exists();

        return response()->json([
            'is_saved' => $isSaved,
        ]);
    }
}
