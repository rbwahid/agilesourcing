import { apiClient } from './client';
import type {
  Design,
  CreateDesignData,
  UpdateDesignData,
  DesignFilters,
  DesignStats,
} from '@/types/design';
import type { PaginatedResponse } from '@/types';

/**
 * Get paginated list of user's designs
 */
export async function getDesigns(
  filters?: DesignFilters
): Promise<PaginatedResponse<Design>> {
  const params = new URLSearchParams();

  if (filters?.status) params.append('status', filters.status);
  if (filters?.category) params.append('category', filters.category);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.per_page) params.append('per_page', String(filters.per_page));
  if (filters?.page) params.append('page', String(filters.page));

  const queryString = params.toString();
  const url = queryString ? `/v1/designs?${queryString}` : '/v1/designs';

  const response = await apiClient.get<PaginatedResponse<Design>>(url);
  return response.data;
}

/**
 * Get a single design by ID
 */
export async function getDesign(id: number): Promise<Design> {
  const response = await apiClient.get<{ data: Design }>(`/v1/designs/${id}`);
  return response.data.data;
}

/**
 * Create a new design with file upload
 */
export async function createDesign(
  data: CreateDesignData
): Promise<{ message: string; data: Design }> {
  const formData = new FormData();

  formData.append('title', data.title);
  formData.append('category', data.category);
  formData.append('design_file', data.design_file);

  if (data.description) formData.append('description', data.description);
  if (data.season) formData.append('season', data.season);
  if (data.target_demographic)
    formData.append('target_demographic', data.target_demographic);
  if (data.status) formData.append('status', data.status);

  const response = await apiClient.post<{ message: string; data: Design }>(
    '/v1/designs',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
}

/**
 * Update a design
 */
export async function updateDesign(
  id: number,
  data: UpdateDesignData
): Promise<{ message: string; data: Design }> {
  const response = await apiClient.put<{ message: string; data: Design }>(
    `/v1/designs/${id}`,
    data
  );
  return response.data;
}

/**
 * Delete a design
 */
export async function deleteDesign(id: number): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>(
    `/v1/designs/${id}`
  );
  return response.data;
}

/**
 * Get design statistics
 */
export async function getDesignStats(): Promise<DesignStats> {
  const response = await apiClient.get<DesignStats>('/v1/designs-stats');
  return response.data;
}

/**
 * Trigger AI analysis for a design
 */
export async function triggerAnalysis(
  id: number
): Promise<{ message: string; data: Design }> {
  const response = await apiClient.post<{ message: string; data: Design }>(
    `/v1/designs/${id}/analyze`
  );
  return response.data;
}

/**
 * Generate variations for a design
 */
export async function generateVariations(
  id: number,
  count?: number
): Promise<{ message: string; data: Design }> {
  const response = await apiClient.post<{ message: string; data: Design }>(
    `/v1/designs/${id}/variations`,
    count ? { count } : undefined
  );
  return response.data;
}

/**
 * Regenerate variations for a design (deletes existing ones)
 */
export async function regenerateVariations(
  id: number,
  count?: number
): Promise<{ message: string; data: Design }> {
  const response = await apiClient.post<{ message: string; data: Design }>(
    `/v1/designs/${id}/variations/regenerate`,
    count ? { count } : undefined
  );
  return response.data;
}
