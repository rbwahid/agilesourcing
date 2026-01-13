<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\SupplierCertificationRequest;
use App\Http\Resources\SupplierCertificationResource;
use App\Models\SupplierCertification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;

class SupplierCertificationController extends Controller
{
    /**
     * Get the authenticated supplier's certifications.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $supplier = $request->user()->profile?->supplier;

        if (! $supplier) {
            abort(404, 'Supplier profile not found.');
        }

        $certifications = $supplier->certificationRecords()
            ->orderBy('created_at', 'desc')
            ->get();

        return SupplierCertificationResource::collection($certifications);
    }

    /**
     * Store a new certification.
     */
    public function store(SupplierCertificationRequest $request): JsonResponse
    {
        $user = $request->user();
        $supplier = $user->profile?->supplier;

        if (! $supplier) {
            return response()->json([
                'message' => 'Supplier profile not found.',
            ], 404);
        }

        // Check if this certification type already exists
        $existingCert = $supplier->certificationRecords()
            ->where('certification_type', $request->certification_type)
            ->first();

        if ($existingCert) {
            return response()->json([
                'message' => 'You already have a certification of this type. Please delete the existing one first.',
            ], 422);
        }

        // Store the certificate file
        $path = $request->file('certificate_file')->store(
            'suppliers/'.$user->id.'/certifications',
            'public'
        );

        $certification = $supplier->certificationRecords()->create([
            'certification_type' => $request->certification_type,
            'certificate_path' => $path,
            'expiry_date' => $request->expiry_date,
        ]);

        return response()->json([
            'message' => 'Certification uploaded successfully.',
            'data' => new SupplierCertificationResource($certification),
        ], 201);
    }

    /**
     * Delete a certification.
     */
    public function destroy(Request $request, SupplierCertification $certification): JsonResponse
    {
        $supplier = $request->user()->profile?->supplier;

        if (! $supplier || $certification->supplier_id !== $supplier->id) {
            return response()->json([
                'message' => 'You do not have permission to delete this certification.',
            ], 403);
        }

        // Delete the certificate file
        if ($certification->certificate_path) {
            Storage::disk('public')->delete($certification->certificate_path);
        }

        $certification->delete();

        return response()->json([
            'message' => 'Certification deleted successfully.',
        ]);
    }

    /**
     * Request verification for a certification.
     */
    public function requestVerification(Request $request, SupplierCertification $certification): JsonResponse
    {
        $supplier = $request->user()->profile?->supplier;

        if (! $supplier || $certification->supplier_id !== $supplier->id) {
            return response()->json([
                'message' => 'You do not have permission to request verification for this certification.',
            ], 403);
        }

        if ($certification->isVerified()) {
            return response()->json([
                'message' => 'This certification is already verified.',
            ], 422);
        }

        // In a real app, this would trigger a notification to admins
        // For now, we just return a success message

        return response()->json([
            'message' => 'Verification request submitted. Our team will review your certification.',
        ]);
    }
}
