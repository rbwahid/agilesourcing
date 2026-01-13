import { apiClient } from './client';
import type {
  Supplier,
  SupplierCertification,
  ProductCatalogItem,
  SupplierSearchFilters,
  SupplierProfileFormData,
  CertificationFormData,
  CatalogItemFormData,
  SupplierStats,
  SupplierDashboardStats,
  SupplierActivity,
  ViewsTimelineData,
} from '@/types/supplier';
import type { PaginatedResponse } from '@/types';

/*
|--------------------------------------------------------------------------
| Supplier Directory API
|--------------------------------------------------------------------------
*/

/**
 * Get paginated list of suppliers with filters
 */
export async function getSuppliers(
  filters?: SupplierSearchFilters
): Promise<PaginatedResponse<Supplier>> {
  const params = new URLSearchParams();

  if (filters?.query) params.append('query', filters.query);
  if (filters?.service_type) params.append('service_type', filters.service_type);
  if (filters?.certifications?.length) {
    filters.certifications.forEach((cert) =>
      params.append('certifications[]', cert)
    );
  }
  if (filters?.location) params.append('location', filters.location);
  if (filters?.min_moq) params.append('min_moq', String(filters.min_moq));
  if (filters?.max_moq) params.append('max_moq', String(filters.max_moq));
  if (filters?.is_verified !== undefined)
    params.append('is_verified', String(filters.is_verified));
  if (filters?.sort_by) params.append('sort_by', filters.sort_by);
  if (filters?.per_page) params.append('per_page', String(filters.per_page));
  if (filters?.page) params.append('page', String(filters.page));

  const queryString = params.toString();
  const url = queryString ? `/v1/suppliers?${queryString}` : '/v1/suppliers';

  const response = await apiClient.get<PaginatedResponse<Supplier>>(url);
  return response.data;
}

/**
 * Get featured suppliers
 */
export async function getFeaturedSuppliers(
  limit?: number
): Promise<Supplier[]> {
  const params = limit ? `?limit=${limit}` : '';
  const response = await apiClient.get<{ data: Supplier[] }>(
    `/v1/suppliers/featured${params}`
  );
  return response.data.data;
}

/**
 * Get personalized supplier recommendations
 */
export async function getSupplierRecommendations(
  limit?: number
): Promise<Supplier[]> {
  const params = limit ? `?limit=${limit}` : '';
  const response = await apiClient.get<{ data: Supplier[] }>(
    `/v1/suppliers/recommendations${params}`
  );
  return response.data.data;
}

/**
 * Get a single supplier by ID
 */
export async function getSupplier(id: number): Promise<Supplier> {
  const response = await apiClient.get<{ data: Supplier }>(
    `/v1/suppliers/${id}`
  );
  return response.data.data;
}

/**
 * Get a supplier's product catalog
 */
export async function getSupplierCatalog(
  supplierId: number
): Promise<ProductCatalogItem[]> {
  const response = await apiClient.get<{ data: ProductCatalogItem[] }>(
    `/v1/suppliers/${supplierId}/catalog`
  );
  return response.data.data;
}

/*
|--------------------------------------------------------------------------
| Saved Suppliers API
|--------------------------------------------------------------------------
*/

/**
 * Get list of saved suppliers
 */
export async function getSavedSuppliers(): Promise<Supplier[]> {
  const response = await apiClient.get<{ data: Supplier[] }>(
    '/v1/saved-suppliers'
  );
  return response.data.data;
}

/**
 * Save a supplier
 */
export async function saveSupplier(
  supplierId: number
): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>(
    `/v1/suppliers/${supplierId}/save`
  );
  return response.data;
}

/**
 * Unsave a supplier
 */
export async function unsaveSupplier(
  supplierId: number
): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>(
    `/v1/suppliers/${supplierId}/save`
  );
  return response.data;
}

/**
 * Check if a supplier is saved
 */
export async function checkSupplierSaved(
  supplierId: number
): Promise<{ is_saved: boolean }> {
  const response = await apiClient.get<{ is_saved: boolean }>(
    `/v1/suppliers/${supplierId}/saved-check`
  );
  return response.data;
}

/*
|--------------------------------------------------------------------------
| Supplier Profile API (for suppliers managing their own profile)
|--------------------------------------------------------------------------
*/

/**
 * Get the authenticated supplier's own profile
 */
export async function getSupplierProfile(): Promise<Supplier> {
  const response = await apiClient.get<{ data: Supplier }>(
    '/v1/supplier/profile'
  );
  return response.data.data;
}

/**
 * Update the authenticated supplier's profile
 */
export async function updateSupplierProfile(
  data: SupplierProfileFormData
): Promise<{ message: string; data: Supplier }> {
  const response = await apiClient.put<{ message: string; data: Supplier }>(
    '/v1/supplier/profile',
    data
  );
  return response.data;
}

/**
 * Upload supplier logo
 */
export async function uploadSupplierLogo(
  file: File
): Promise<{ message: string; data: { logo_url: string } }> {
  const formData = new FormData();
  formData.append('logo', file);

  const response = await apiClient.post<{
    message: string;
    data: { logo_url: string };
  }>('/v1/supplier/logo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

/**
 * Get supplier dashboard statistics
 */
export async function getSupplierStats(): Promise<SupplierDashboardStats> {
  const response = await apiClient.get<SupplierDashboardStats>('/v1/supplier/stats');
  return response.data;
}

/**
 * Get supplier profile views timeline
 */
export async function getSupplierViewsTimeline(
  days: number = 30
): Promise<ViewsTimelineData[]> {
  const response = await apiClient.get<{ data: ViewsTimelineData[] }>(
    `/v1/supplier/stats/views?days=${days}`
  );
  return response.data.data;
}

/**
 * Get supplier recent activity
 */
export async function getSupplierActivity(
  limit: number = 10
): Promise<SupplierActivity[]> {
  const response = await apiClient.get<{ data: SupplierActivity[] }>(
    `/v1/supplier/activity?limit=${limit}`
  );
  return response.data.data;
}

/*
|--------------------------------------------------------------------------
| Certification API
|--------------------------------------------------------------------------
*/

/**
 * Get the authenticated supplier's certifications
 */
export async function getSupplierCertifications(): Promise<
  SupplierCertification[]
> {
  const response = await apiClient.get<{ data: SupplierCertification[] }>(
    '/v1/supplier/certifications'
  );
  return response.data.data;
}

/**
 * Add a new certification
 */
export async function addCertification(
  data: CertificationFormData
): Promise<{ message: string; data: SupplierCertification }> {
  const formData = new FormData();
  formData.append('certification_type', data.certification_type);
  formData.append('certificate_file', data.certificate_file);
  formData.append('expiry_date', data.expiry_date);
  if (data.certificate_number) {
    formData.append('certificate_number', data.certificate_number);
  }

  const response = await apiClient.post<{
    message: string;
    data: SupplierCertification;
  }>('/v1/supplier/certifications', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

/**
 * Delete a certification
 */
export async function deleteCertification(
  id: number
): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>(
    `/v1/supplier/certifications/${id}`
  );
  return response.data;
}

/**
 * Request verification for a certification
 */
export async function requestCertificationVerification(
  id: number
): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>(
    `/v1/supplier/certifications/${id}/verify`
  );
  return response.data;
}

/*
|--------------------------------------------------------------------------
| Product Catalog API
|--------------------------------------------------------------------------
*/

/**
 * Get the authenticated supplier's own catalog
 */
export async function getOwnCatalog(): Promise<ProductCatalogItem[]> {
  const response = await apiClient.get<{ data: ProductCatalogItem[] }>(
    '/v1/supplier/catalog'
  );
  return response.data.data;
}

/**
 * Add a new catalog item
 */
export async function addCatalogItem(
  data: CatalogItemFormData
): Promise<{ message: string; data: ProductCatalogItem }> {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('category', data.category);

  if (data.description) {
    formData.append('description', data.description);
  }
  if (data.images?.length) {
    data.images.forEach((image) => {
      formData.append('images[]', image);
    });
  }
  if (data.specifications) {
    Object.entries(data.specifications).forEach(([key, value]) => {
      formData.append(`specifications[${key}]`, value);
    });
  }
  if (data.is_active !== undefined) {
    formData.append('is_active', String(data.is_active));
  }

  const response = await apiClient.post<{
    message: string;
    data: ProductCatalogItem;
  }>('/v1/supplier/catalog', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

/**
 * Update a catalog item
 */
export async function updateCatalogItem(
  id: number,
  data: CatalogItemFormData
): Promise<{ message: string; data: ProductCatalogItem }> {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('category', data.category);

  if (data.description) {
    formData.append('description', data.description);
  }
  if (data.images?.length) {
    data.images.forEach((image) => {
      formData.append('images[]', image);
    });
  }
  if (data.specifications) {
    Object.entries(data.specifications).forEach(([key, value]) => {
      formData.append(`specifications[${key}]`, value);
    });
  }
  if (data.is_active !== undefined) {
    formData.append('is_active', String(data.is_active));
  }

  // Use POST with _method override for multipart form data
  formData.append('_method', 'PUT');

  const response = await apiClient.post<{
    message: string;
    data: ProductCatalogItem;
  }>(`/v1/supplier/catalog/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

/**
 * Delete a catalog item
 */
export async function deleteCatalogItem(
  id: number
): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>(
    `/v1/supplier/catalog/${id}`
  );
  return response.data;
}
