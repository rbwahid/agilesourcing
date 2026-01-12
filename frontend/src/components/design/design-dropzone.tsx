'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from '@/types/design';
import { Upload, X, FileImage, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DesignDropzoneProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  disabled?: boolean;
}

export function DesignDropzone({
  value,
  onChange,
  error,
  disabled = false,
}: DesignDropzoneProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        onChange(file);

        // Generate preview for images
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = () => {
            setPreview(reader.result as string);
          };
          reader.readAsDataURL(file);
        } else {
          setPreview(null);
        }
      }
    },
    [onChange]
  );

  const removeFile = useCallback(() => {
    onChange(null);
    setPreview(null);
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: ACCEPTED_FILE_TYPES,
      maxSize: MAX_FILE_SIZE,
      multiple: false,
      disabled,
    });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type: string) => {
    if (type === 'application/pdf') {
      return <FileText className="h-12 w-12 text-red-500" />;
    }
    return <FileImage className="h-12 w-12 text-agile-teal" />;
  };

  // File selected state
  if (value) {
    return (
      <div className="relative">
        <div
          className={cn(
            'relative overflow-hidden rounded-xl border-2 border-dashed border-agile-teal/30 bg-agile-teal/5 transition-all duration-300',
            error && 'border-red-400 bg-red-50'
          )}
        >
          <div className="flex items-center gap-6 p-6">
            {/* Preview */}
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 shadow-inner">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  {getFileIcon(value.type)}
                </div>
              )}
            </div>

            {/* File info */}
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-charcoal">
                {value.name}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {formatFileSize(value.size)}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-agile-teal/10 px-2.5 py-0.5 text-xs font-medium text-agile-teal">
                  {value.type.split('/')[1].toUpperCase()}
                </span>
                <span className="text-xs text-gray-400">Ready to upload</span>
              </div>
            </div>

            {/* Remove button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={removeFile}
              disabled={disabled}
              className="absolute right-3 top-3 h-8 w-8 rounded-full bg-white shadow-sm hover:bg-red-50 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {error && (
          <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
      </div>
    );
  }

  // Dropzone state
  return (
    <div className="relative">
      <div
        {...getRootProps()}
        className={cn(
          'group relative cursor-pointer overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300',
          'border-gray-200 bg-gray-50/50 hover:border-agile-teal/50 hover:bg-agile-teal/5',
          isDragActive && !isDragReject && 'border-agile-teal bg-agile-teal/10',
          isDragReject && 'border-red-400 bg-red-50',
          error && 'border-red-400 bg-red-50',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <input {...getInputProps()} />

        {/* Animated background pattern */}
        <div
          className={cn(
            'absolute inset-0 opacity-0 transition-opacity duration-300',
            isDragActive && !isDragReject && 'opacity-100'
          )}
          style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, rgba(0, 179, 145, 0.1) 2px, transparent 2px)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative px-8 py-12 text-center">
          {/* Upload icon with animation */}
          <div
            className={cn(
              'mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300',
              'bg-gray-100 text-gray-400 group-hover:bg-agile-teal/10 group-hover:text-agile-teal',
              isDragActive && !isDragReject && 'animate-pulse bg-agile-teal/20 text-agile-teal scale-110',
              isDragReject && 'bg-red-100 text-red-500'
            )}
          >
            <Upload
              className={cn(
                'h-8 w-8 transition-transform duration-300',
                isDragActive && !isDragReject && '-translate-y-1'
              )}
            />
          </div>

          {/* Text content */}
          <div className="space-y-2">
            {isDragActive && !isDragReject ? (
              <p className="text-lg font-semibold text-agile-teal">
                Drop your design here
              </p>
            ) : isDragReject ? (
              <p className="text-lg font-semibold text-red-600">
                File type not supported
              </p>
            ) : (
              <>
                <p className="text-lg font-semibold text-charcoal">
                  <span className="text-agile-teal">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-sm text-gray-500">
                  JPG, PNG, or PDF up to 10MB
                </p>
              </>
            )}
          </div>

          {/* File type badges */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {['JPG', 'PNG', 'PDF'].map((type) => (
              <span
                key={type}
                className={cn(
                  'inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium transition-colors duration-200',
                  'bg-white text-gray-600 shadow-sm ring-1 ring-inset ring-gray-200',
                  isDragActive && !isDragReject && 'bg-agile-teal/10 text-agile-teal ring-agile-teal/30'
                )}
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}
