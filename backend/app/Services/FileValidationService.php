<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

class FileValidationService
{
    /**
     * Allowed MIME types and their expected file signatures (magic bytes).
     */
    protected array $allowedTypes = [
        // Images
        'image/jpeg' => ['FFD8FF'],
        'image/png' => ['89504E47'],
        'image/gif' => ['47494638'],
        'image/webp' => ['52494646'],
        // Documents
        'application/pdf' => ['25504446'],
        'application/msword' => ['D0CF11E0'], // .doc
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => ['504B0304'], // .docx
    ];

    /**
     * Maximum file sizes in bytes by category.
     */
    protected array $maxSizes = [
        'image' => 10 * 1024 * 1024, // 10MB
        'document' => 20 * 1024 * 1024, // 20MB
        'default' => 10 * 1024 * 1024, // 10MB
    ];

    /**
     * Validate an uploaded file for security concerns.
     */
    public function validate(UploadedFile $file, array $allowedMimeTypes = []): bool
    {
        // Check if file is valid
        if (! $file->isValid()) {
            Log::warning('Invalid file upload attempted', [
                'original_name' => $file->getClientOriginalName(),
                'error' => $file->getError(),
            ]);

            return false;
        }

        // Get the actual MIME type from file content
        $actualMimeType = $file->getMimeType();

        // Check against allowed MIME types
        if (! empty($allowedMimeTypes) && ! in_array($actualMimeType, $allowedMimeTypes)) {
            Log::warning('File upload rejected - MIME type not allowed', [
                'original_name' => $file->getClientOriginalName(),
                'claimed_type' => $file->getClientMimeType(),
                'actual_type' => $actualMimeType,
            ]);

            return false;
        }

        // Verify MIME type matches file signature
        if (! $this->verifyFileSignature($file, $actualMimeType)) {
            Log::warning('File upload rejected - signature mismatch', [
                'original_name' => $file->getClientOriginalName(),
                'claimed_type' => $file->getClientMimeType(),
                'actual_type' => $actualMimeType,
            ]);

            return false;
        }

        // Check file size
        if (! $this->validateFileSize($file)) {
            Log::warning('File upload rejected - size exceeded', [
                'original_name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
            ]);

            return false;
        }

        // Check for dangerous file extensions
        if ($this->hasDangerousExtension($file)) {
            Log::warning('File upload rejected - dangerous extension', [
                'original_name' => $file->getClientOriginalName(),
                'extension' => $file->getClientOriginalExtension(),
            ]);

            return false;
        }

        return true;
    }

    /**
     * Verify that the file content matches its claimed MIME type.
     */
    protected function verifyFileSignature(UploadedFile $file, string $mimeType): bool
    {
        if (! isset($this->allowedTypes[$mimeType])) {
            // Unknown MIME type - reject by default for security
            return false;
        }

        $signatures = $this->allowedTypes[$mimeType];
        $handle = fopen($file->getRealPath(), 'rb');

        if (! $handle) {
            return false;
        }

        // Read first 8 bytes for signature check
        $header = fread($handle, 8);
        fclose($handle);

        if ($header === false) {
            return false;
        }

        $hexHeader = strtoupper(bin2hex($header));

        foreach ($signatures as $signature) {
            if (str_starts_with($hexHeader, $signature)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Validate file size based on file type category.
     */
    protected function validateFileSize(UploadedFile $file): bool
    {
        $mimeType = $file->getMimeType();
        $size = $file->getSize();

        if (str_starts_with($mimeType, 'image/')) {
            return $size <= $this->maxSizes['image'];
        }

        if (in_array($mimeType, ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])) {
            return $size <= $this->maxSizes['document'];
        }

        return $size <= $this->maxSizes['default'];
    }

    /**
     * Check for dangerous file extensions.
     */
    protected function hasDangerousExtension(UploadedFile $file): bool
    {
        $dangerousExtensions = [
            'php', 'php3', 'php4', 'php5', 'phtml', 'phar',
            'exe', 'bat', 'cmd', 'sh', 'bash',
            'js', 'jsx', 'ts', 'tsx',
            'htaccess', 'htpasswd',
            'asp', 'aspx', 'cer', 'csr',
            'jsp', 'jspx',
            'cgi', 'pl', 'py', 'rb',
            'swf', 'svg', // SVG can contain scripts
        ];

        $extension = strtolower($file->getClientOriginalExtension());

        return in_array($extension, $dangerousExtensions);
    }

    /**
     * Sanitize a filename for safe storage.
     */
    public function sanitizeFilename(string $filename): string
    {
        // Remove any directory traversal attempts
        $filename = basename($filename);

        // Remove null bytes
        $filename = str_replace("\0", '', $filename);

        // Remove any character that isn't alphanumeric, underscore, hyphen, or dot
        $filename = preg_replace('/[^a-zA-Z0-9_\-\.]/', '_', $filename);

        // Remove multiple consecutive underscores/dots
        $filename = preg_replace('/_{2,}/', '_', $filename);
        $filename = preg_replace('/\.{2,}/', '.', $filename);

        // Ensure filename doesn't start with a dot (hidden file)
        $filename = ltrim($filename, '.');

        // Limit length
        if (strlen($filename) > 255) {
            $extension = pathinfo($filename, PATHINFO_EXTENSION);
            $name = pathinfo($filename, PATHINFO_FILENAME);
            $filename = substr($name, 0, 250 - strlen($extension)).'.'.$extension;
        }

        return $filename ?: 'unnamed_file';
    }

    /**
     * Generate a safe storage path for a file.
     */
    public function generateStoragePath(string $type, int $ownerId): string
    {
        return sprintf(
            '%s/%d/%s',
            $type,
            $ownerId,
            date('Y/m')
        );
    }
}
