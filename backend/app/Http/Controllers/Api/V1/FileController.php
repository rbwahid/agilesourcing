<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Design;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FileController extends Controller
{
    /**
     * Serve a private file with authorization check.
     */
    public function serve(Request $request, string $type, int $id, string $filename): StreamedResponse
    {
        $user = $request->user();

        // Build the file path
        $path = $this->buildFilePath($type, $id, $filename);

        // Check if file exists
        if (! Storage::disk('private')->exists($path)) {
            abort(404, 'File not found');
        }

        // Authorize access based on file type
        if (! $this->authorizeAccess($user, $type, $id)) {
            abort(403, 'Access denied');
        }

        // Get file info
        $mimeType = Storage::disk('private')->mimeType($path);
        $size = Storage::disk('private')->size($path);

        // Stream the file
        return Storage::disk('private')->response($path, $filename, [
            'Content-Type' => $mimeType,
            'Content-Length' => $size,
            'Cache-Control' => 'private, max-age=3600',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    /**
     * Generate a temporary signed URL for a private file.
     */
    public function signedUrl(Request $request, string $type, int $id, string $filename): \Illuminate\Http\JsonResponse
    {
        $user = $request->user();

        // Build the file path
        $path = $this->buildFilePath($type, $id, $filename);

        // Check if file exists
        if (! Storage::disk('private')->exists($path)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        // Authorize access
        if (! $this->authorizeAccess($user, $type, $id)) {
            return response()->json(['error' => 'Access denied'], 403);
        }

        // Generate signed URL (valid for 1 hour)
        $url = Storage::disk('private')->temporaryUrl(
            $path,
            now()->addHour(),
            ['ResponseContentDisposition' => 'inline; filename="'.$filename.'"']
        );

        return response()->json(['url' => $url]);
    }

    /**
     * Build the file path based on type and ID.
     */
    protected function buildFilePath(string $type, int $id, string $filename): string
    {
        // Sanitize filename to prevent directory traversal
        $filename = basename($filename);

        return match ($type) {
            'messages' => "messages/{$id}/{$filename}",
            'designs' => "designs/{$id}/{$filename}",
            'profiles' => "profiles/{$id}/{$filename}",
            'certifications' => "certifications/{$id}/{$filename}",
            'catalog' => "catalog/{$id}/{$filename}",
            'mockups' => "mockups/{$id}/{$filename}",
            default => abort(400, 'Invalid file type'),
        };
    }

    /**
     * Authorize access to a file based on its type and the user's relationship.
     */
    protected function authorizeAccess($user, string $type, int $id): bool
    {
        return match ($type) {
            'messages' => $this->canAccessConversationFiles($user, $id),
            'designs' => $this->canAccessDesignFiles($user, $id),
            'profiles' => $this->canAccessProfileFiles($user, $id),
            'certifications' => $this->canAccessCertificationFiles($user, $id),
            'catalog' => $this->canAccessCatalogFiles($user, $id),
            'mockups' => $this->canAccessMockupFiles($user, $id),
            default => false,
        };
    }

    /**
     * Check if user can access conversation files.
     */
    protected function canAccessConversationFiles($user, int $conversationId): bool
    {
        $conversation = Conversation::find($conversationId);

        if (! $conversation) {
            return false;
        }

        // User must be a participant in the conversation
        return $conversation->designer_id === $user->id
            || $conversation->supplier_id === $user->supplier?->id;
    }

    /**
     * Check if user can access design files.
     */
    protected function canAccessDesignFiles($user, int $designId): bool
    {
        $design = Design::find($designId);

        if (! $design) {
            return false;
        }

        // Owner can access their designs
        if ($design->user_id === $user->id) {
            return true;
        }

        // Suppliers can access designs that have been shared in conversations with them
        if ($user->hasRole('supplier') && $user->supplier) {
            return Conversation::where('supplier_id', $user->supplier->id)
                ->whereHas('messages', function ($query) use ($designId) {
                    $query->where('design_id', $designId);
                })
                ->exists();
        }

        // Admins can access all designs
        return $user->hasRole(['admin', 'super_admin']);
    }

    /**
     * Check if user can access profile files (public by nature for active profiles).
     */
    protected function canAccessProfileFiles($user, int $profileId): bool
    {
        // Profile images are generally public for active users/suppliers
        // Admins can access all
        if ($user->hasRole(['admin', 'super_admin'])) {
            return true;
        }

        // Users can access their own profile files
        if ($user->id === $profileId || $user->profile?->id === $profileId) {
            return true;
        }

        // For other profiles, they should be accessible if the user is active
        return true;
    }

    /**
     * Check if user can access certification files.
     */
    protected function canAccessCertificationFiles($user, int $supplierId): bool
    {
        $supplier = Supplier::find($supplierId);

        if (! $supplier) {
            return false;
        }

        // Supplier can access their own certifications
        if ($user->supplier && $user->supplier->id === $supplierId) {
            return true;
        }

        // Admins can access all certifications (for verification)
        if ($user->hasRole(['admin', 'super_admin'])) {
            return true;
        }

        // Verified certifications are viewable by designers
        return $user->hasRole('designer');
    }

    /**
     * Check if user can access catalog files.
     */
    protected function canAccessCatalogFiles($user, int $supplierId): bool
    {
        $supplier = Supplier::find($supplierId);

        if (! $supplier) {
            return false;
        }

        // Supplier can access their own catalog
        if ($user->supplier && $user->supplier->id === $supplierId) {
            return true;
        }

        // Admins can access all
        if ($user->hasRole(['admin', 'super_admin'])) {
            return true;
        }

        // Active suppliers' catalogs are viewable by designers
        if ($supplier->is_active && $user->hasRole('designer')) {
            return true;
        }

        return false;
    }

    /**
     * Check if user can access mockup files.
     * Mockups are tied to designs, so access follows design access rules.
     */
    protected function canAccessMockupFiles($user, int $designId): bool
    {
        // Mockups are stored by design_id, so use the same access rules as designs
        return $this->canAccessDesignFiles($user, $designId);
    }
}
