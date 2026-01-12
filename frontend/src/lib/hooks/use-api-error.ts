'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';
import {
  isApiError,
  isValidationError,
  getErrorMessage,
  ValidationError,
} from '@/lib/api/errors';

interface UseApiErrorOptions {
  showToast?: boolean;
}

interface UseApiErrorReturn {
  handleError: (error: unknown, customMessage?: string) => void;
  getValidationErrors: (error: unknown) => Record<string, string[]> | null;
  getFieldError: (error: unknown, field: string) => string | undefined;
}

/**
 * Hook for consistent API error handling
 */
export function useApiError(options: UseApiErrorOptions = {}): UseApiErrorReturn {
  const { showToast = true } = options;

  /**
   * Handle any error and optionally show toast
   */
  const handleError = useCallback(
    (error: unknown, customMessage?: string) => {
      const message = customMessage || getErrorMessage(error);

      if (showToast) {
        // Don't show toast for validation errors (form should handle it)
        if (!isValidationError(error)) {
          toast.error('Error', {
            description: message,
          });
        }
      }

      // Log error in development
      if (process.env.NODE_ENV === 'development') {
        console.error('API Error:', error);
      }
    },
    [showToast]
  );

  /**
   * Extract validation errors from error object
   */
  const getValidationErrors = useCallback(
    (error: unknown): Record<string, string[]> | null => {
      if (isValidationError(error)) {
        return error.errors;
      }
      return null;
    },
    []
  );

  /**
   * Get specific field error from validation error
   */
  const getFieldError = useCallback(
    (error: unknown, field: string): string | undefined => {
      if (isValidationError(error)) {
        return error.getFieldError(field);
      }
      return undefined;
    },
    []
  );

  return {
    handleError,
    getValidationErrors,
    getFieldError,
  };
}

/**
 * Utility to set form errors from validation error
 * Works with react-hook-form's setError
 */
export function setFormErrors(
  error: unknown,
  setError: (name: string, error: { type: string; message: string }) => void
): boolean {
  if (!isValidationError(error)) {
    return false;
  }

  Object.entries(error.errors).forEach(([field, messages]) => {
    setError(field, {
      type: 'server',
      message: messages[0],
    });
  });

  return true;
}
