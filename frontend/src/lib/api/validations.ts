import { apiClient } from './client';
import type {
  Validation,
  ValidationMetrics,
  CreateValidationData,
  ValidationFilters,
} from '@/types/validation';
import type { PaginatedResponse } from '@/types';

/**
 * Get paginated list of user's validations
 */
export async function getValidations(
  filters?: ValidationFilters
): Promise<{ data: Validation[]; meta: { current_page: number; last_page: number; per_page: number; total: number } }> {
  const params = new URLSearchParams();

  if (filters?.status) params.append('status', filters.status);
  if (filters?.per_page) params.append('per_page', String(filters.per_page));
  if (filters?.page) params.append('page', String(filters.page));

  const queryString = params.toString();
  const url = queryString ? `/v1/validations?${queryString}` : '/v1/validations';

  const response = await apiClient.get<{
    data: Validation[];
    meta: { current_page: number; last_page: number; per_page: number; total: number };
  }>(url);
  return response.data;
}

/**
 * Get a single validation by ID
 */
export async function getValidation(id: number): Promise<Validation> {
  const response = await apiClient.get<{ data: Validation }>(`/v1/validations/${id}`);
  return response.data.data;
}

/**
 * Create a new validation campaign
 */
export async function createValidation(
  data: CreateValidationData
): Promise<{ message: string; data: Validation }> {
  const response = await apiClient.post<{ message: string; data: Validation }>(
    '/v1/validations',
    data
  );
  return response.data;
}

/**
 * Cancel an active validation
 */
export async function cancelValidation(id: number): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>(
    `/v1/validations/${id}/cancel`
  );
  return response.data;
}

/**
 * Get validation metrics/insights
 */
export async function getValidationMetrics(id: number): Promise<ValidationMetrics> {
  const response = await apiClient.get<{ data: ValidationMetrics }>(
    `/v1/validations/${id}/metrics`
  );
  return response.data.data;
}
