import { apiClient } from './client';
import type { Mockup, MockupOptions } from '@/types/instagram';

/**
 * Get all mockups for a design
 */
export async function getMockups(designId: number): Promise<Mockup[]> {
  const response = await apiClient.get<{ data: Mockup[] }>(
    `/v1/designs/${designId}/mockups`
  );
  return response.data.data;
}

/**
 * Create a new mockup for a design
 */
export async function createMockup(
  designId: number,
  options: MockupOptions
): Promise<{ message: string; data: Mockup }> {
  const response = await apiClient.post<{ message: string; data: Mockup }>(
    `/v1/designs/${designId}/mockups`,
    options
  );
  return response.data;
}

/**
 * Get a single mockup by ID
 */
export async function getMockup(mockupId: number): Promise<Mockup> {
  const response = await apiClient.get<{ data: Mockup }>(`/v1/mockups/${mockupId}`);
  return response.data.data;
}

/**
 * Delete a mockup
 */
export async function deleteMockup(mockupId: number): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>(`/v1/mockups/${mockupId}`);
  return response.data;
}
