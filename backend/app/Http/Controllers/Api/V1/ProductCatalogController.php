<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductCatalogRequest;
use App\Http\Resources\ProductCatalogItemResource;
use App\Models\ProductCatalogItem;
use App\Models\Supplier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;

class ProductCatalogController extends Controller
{
    /**
     * Get a supplier's public product catalog.
     */
    public function index(Supplier $supplier): AnonymousResourceCollection
    {
        $items = $supplier->productCatalog()
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return ProductCatalogItemResource::collection($items);
    }

    /**
     * Get the authenticated supplier's own catalog.
     */
    public function ownIndex(Request $request): AnonymousResourceCollection
    {
        $supplier = $request->user()->profile?->supplier;

        if (! $supplier) {
            abort(404, 'Supplier profile not found.');
        }

        $items = $supplier->productCatalog()
            ->orderBy('created_at', 'desc')
            ->get();

        return ProductCatalogItemResource::collection($items);
    }

    /**
     * Store a new catalog item.
     */
    public function store(ProductCatalogRequest $request): JsonResponse
    {
        $user = $request->user();
        $supplier = $user->profile?->supplier;

        if (! $supplier) {
            return response()->json([
                'message' => 'Supplier profile not found.',
            ], 404);
        }

        // Process images
        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store(
                    'suppliers/'.$user->id.'/catalog',
                    'public'
                );
                $imagePaths[] = $path;
            }
        }

        $item = $supplier->productCatalog()->create([
            'name' => $request->name,
            'description' => $request->description,
            'category' => $request->category,
            'images' => $imagePaths,
            'specifications' => $request->specifications ?? [],
            'is_active' => $request->is_active ?? true,
        ]);

        return response()->json([
            'message' => 'Catalog item created successfully.',
            'data' => new ProductCatalogItemResource($item),
        ], 201);
    }

    /**
     * Update a catalog item.
     */
    public function update(ProductCatalogRequest $request, ProductCatalogItem $item): JsonResponse
    {
        $user = $request->user();
        $supplier = $user->profile?->supplier;

        if (! $supplier || $item->supplier_id !== $supplier->id) {
            return response()->json([
                'message' => 'You do not have permission to update this catalog item.',
            ], 403);
        }

        $updateData = [
            'name' => $request->name,
            'description' => $request->description,
            'category' => $request->category,
            'specifications' => $request->specifications ?? $item->specifications,
        ];

        if ($request->has('is_active')) {
            $updateData['is_active'] = $request->is_active;
        }

        // Handle new images
        if ($request->hasFile('images')) {
            // Delete old images
            foreach ($item->images ?? [] as $oldPath) {
                Storage::disk('public')->delete($oldPath);
            }

            // Store new images
            $imagePaths = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store(
                    'suppliers/'.$user->id.'/catalog',
                    'public'
                );
                $imagePaths[] = $path;
            }
            $updateData['images'] = $imagePaths;
        }

        $item->update($updateData);

        return response()->json([
            'message' => 'Catalog item updated successfully.',
            'data' => new ProductCatalogItemResource($item->fresh()),
        ]);
    }

    /**
     * Delete a catalog item.
     */
    public function destroy(Request $request, ProductCatalogItem $item): JsonResponse
    {
        $supplier = $request->user()->profile?->supplier;

        if (! $supplier || $item->supplier_id !== $supplier->id) {
            return response()->json([
                'message' => 'You do not have permission to delete this catalog item.',
            ], 403);
        }

        // Delete images
        foreach ($item->images ?? [] as $path) {
            Storage::disk('public')->delete($path);
        }

        $item->delete();

        return response()->json([
            'message' => 'Catalog item deleted successfully.',
        ]);
    }
}
