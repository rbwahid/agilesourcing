/**
 * Custom API Error Classes and Helpers
 */

export interface ApiErrorData {
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Base API Error class
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly data: ApiErrorData;

  constructor(status: number, data: ApiErrorData) {
    super(data.message || 'An error occurred');
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Validation Error class for 422 responses
 */
export class ValidationError extends ApiError {
  public readonly errors: Record<string, string[]>;

  constructor(data: ApiErrorData) {
    super(422, data);
    this.name = 'ValidationError';
    this.errors = data.errors || {};
  }

  /**
   * Get the first error message for a specific field
   */
  getFieldError(field: string): string | undefined {
    return this.errors[field]?.[0];
  }

  /**
   * Get all error messages as a flat array
   */
  getAllMessages(): string[] {
    return Object.values(this.errors).flat();
  }
}

/**
 * Type guard to check if error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Type guard to check if error is a ValidationError
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

/**
 * Get the first error message from a validation errors object
 */
export function getFirstError(errors: Record<string, string[]>): string {
  const firstKey = Object.keys(errors)[0];
  return firstKey ? errors[firstKey][0] : 'Validation failed';
}

/**
 * Get validation errors from an error object
 * Returns empty object if not a validation error
 */
export function getValidationErrors(error: unknown): Record<string, string[]> {
  if (isValidationError(error)) {
    return error.errors;
  }
  return {};
}

/**
 * Extract error message from any error type
 */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}

/**
 * Create appropriate error instance from axios error response
 */
export function createApiError(status: number, data: any): ApiError {
  const errorData: ApiErrorData = {
    message: data?.message || getDefaultErrorMessage(status),
    errors: data?.errors,
  };

  if (status === 422) {
    return new ValidationError(errorData);
  }

  return new ApiError(status, errorData);
}

/**
 * Get default error message based on status code
 */
function getDefaultErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Bad request';
    case 401:
      return 'Please log in to continue';
    case 403:
      return 'You do not have permission to perform this action';
    case 404:
      return 'The requested resource was not found';
    case 422:
      return 'Validation failed';
    case 429:
      return 'Too many requests. Please try again later';
    case 500:
      return 'Server error. Please try again later';
    case 502:
      return 'Service temporarily unavailable';
    case 503:
      return 'Service temporarily unavailable';
    default:
      return 'An error occurred';
  }
}
