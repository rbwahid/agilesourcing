import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { createApiError, ApiError } from './errors';

// Use env var for local dev, hardcoded for production (Turbopack has issues with env vars)
const isDev = process.env.NODE_ENV === 'development';
const API_BASE_URL = isDev
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api')
  : 'https://api.agilesourcing.ca/api';
const SANCTUM_URL = isDev
  ? (process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000')
  : 'https://api.agilesourcing.ca';

/**
 * Main API client instance
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
});

/**
 * Fetch CSRF token from Laravel Sanctum
 * Must be called before making authenticated requests
 */
export async function getCsrfToken(): Promise<void> {
  await axios.get(`${SANCTUM_URL}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });
}

/**
 * Request interceptor
 * - Adds XSRF token from cookie if available
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get XSRF token from cookie (set by Sanctum)
    if (typeof document !== 'undefined') {
      const xsrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

      if (xsrfToken) {
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * - Handles all error status codes
 * - Shows toast notifications for errors
 * - Transforms errors to ApiError instances
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Network error or no response
    if (!error.response) {
      toast.error('Network error', {
        description: 'Please check your internet connection',
      });
      return Promise.reject(new ApiError(0, { message: 'Network error' }));
    }

    const { status, data } = error.response;
    const apiError = createApiError(status, data);

    // Handle specific status codes
    switch (status) {
      case 401:
        // Don't show toast for 401 on /user endpoint (expected when not logged in)
        if (!error.config?.url?.includes('/user')) {
          toast.error('Session expired', {
            description: 'Please log in again',
          });
        }
        // Redirect to login page (only on client side)
        // Use exact match to prevent matching paths like /login-attempt
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          // Clear any stored auth state here if needed
          window.location.href = '/login';
        }
        break;

      case 403:
        toast.error('Access denied', {
          description: apiError.message,
        });
        break;

      case 404:
        // Only show toast for non-API resource requests
        if (!error.config?.url?.includes('/api/')) {
          toast.error('Not found', {
            description: apiError.message,
          });
        }
        break;

      case 422:
        // Validation errors - don't show generic toast, let form handle it
        // The ValidationError will be available for form-level handling
        break;

      case 429:
        toast.error('Too many requests', {
          description: 'Please wait a moment and try again',
        });
        break;

      case 500:
      case 502:
      case 503:
        toast.error('Server error', {
          description: 'Something went wrong. Please try again later.',
        });
        break;

      default:
        if (status >= 400) {
          toast.error('Error', {
            description: apiError.message,
          });
        }
    }

    return Promise.reject(apiError);
  }
);

export default apiClient;
