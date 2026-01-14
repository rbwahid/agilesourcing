<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RejectVerificationRequest;
use App\Http\Resources\Admin\VerificationResource;
use App\Models\SupplierCertification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VerificationController extends Controller
{
    /**
     * List pending verifications.
     */
    public function index(Request $request): JsonResponse
    {
        $query = SupplierCertification::with(['supplier.profile.user'])
            ->whereNull('verified_at');

        // Filter by certification type
        if ($type = $request->input('certification_type')) {
            $query->where('certification_type', $type);
        }

        // Filter by status (pending/all)
        if ($request->input('status') === 'all') {
            $query = SupplierCertification::with(['supplier.profile.user']);
        }

        // Sort
        $sortField = $request->input('sort', 'created_at');
        $sortDirection = $request->input('direction', 'desc');

        if (in_array($sortField, ['created_at', 'certification_type'])) {
            $query->orderBy($sortField, $sortDirection);
        }

        $certifications = $query->paginate($request->input('per_page', 15));

        return response()->json([
            'data' => VerificationResource::collection($certifications),
            'meta' => [
                'current_page' => $certifications->currentPage(),
                'last_page' => $certifications->lastPage(),
                'per_page' => $certifications->perPage(),
                'total' => $certifications->total(),
            ],
        ]);
    }

    /**
     * Get single verification details.
     */
    public function show(SupplierCertification $certification): JsonResponse
    {
        $certification->load(['supplier.profile.user', 'verifier']);

        return response()->json([
            'data' => new VerificationResource($certification),
        ]);
    }

    /**
     * Approve a certification.
     */
    public function approve(Request $request, SupplierCertification $certification): JsonResponse
    {
        // Check if already verified
        if ($certification->verified_at !== null) {
            return response()->json([
                'message' => 'This certification has already been verified.',
            ], 422);
        }

        $certification->update([
            'verified_at' => now(),
            'verified_by' => $request->user()->id,
        ]);

        // Update supplier's is_verified status if they have at least one verified certification
        $supplier = $certification->supplier;
        if ($supplier && ! $supplier->is_verified) {
            $verifiedCount = $supplier->certificationRecords()
                ->whereNotNull('verified_at')
                ->count();

            if ($verifiedCount > 0) {
                $supplier->update(['is_verified' => true]);
            }
        }

        activity()
            ->causedBy($request->user())
            ->performedOn($certification)
            ->withProperties([
                'certification_type' => $certification->certification_type,
                'supplier_id' => $certification->supplier_id,
            ])
            ->log('Approved certification');

        return response()->json([
            'message' => 'Certification approved successfully.',
            'data' => new VerificationResource($certification->fresh(['supplier.profile.user', 'verifier'])),
        ]);
    }

    /**
     * Reject a certification.
     */
    public function reject(RejectVerificationRequest $request, SupplierCertification $certification): JsonResponse
    {
        // Check if already verified
        if ($certification->verified_at !== null) {
            return response()->json([
                'message' => 'Cannot reject an already verified certification.',
            ], 422);
        }

        // For rejection, we delete the certification record
        // The supplier can resubmit with correct documents
        $certificationType = $certification->certification_type;
        $supplierId = $certification->supplier_id;
        $feedback = $request->input('feedback');

        $certification->delete();

        activity()
            ->causedBy($request->user())
            ->withProperties([
                'certification_type' => $certificationType,
                'supplier_id' => $supplierId,
                'feedback' => $feedback,
            ])
            ->log('Rejected certification');

        // TODO: Send notification email to supplier with feedback
        // Notification::send($supplier->profile->user, new CertificationRejectedNotification($feedback));

        return response()->json([
            'message' => 'Certification rejected. Supplier has been notified.',
        ]);
    }

    /**
     * Get certification types for filtering.
     */
    public function types(): JsonResponse
    {
        $types = SupplierCertification::select('certification_type')
            ->distinct()
            ->pluck('certification_type');

        return response()->json([
            'data' => $types,
        ]);
    }
}
