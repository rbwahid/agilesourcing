'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  getSuppliers,
  getFeaturedSuppliers,
  getSupplierRecommendations,
  getSupplier,
  getSupplierCatalog,
  getSavedSuppliers,
  saveSupplier,
  unsaveSupplier,
  checkSupplierSaved,
  getSupplierProfile,
  updateSupplierProfile,
  uploadSupplierLogo,
  getSupplierStats,
  getSupplierViewsTimeline,
  getSupplierActivity,
  getSupplierCertifications,
  addCertification,
  deleteCertification,
  requestCertificationVerification,
  getOwnCatalog,
  addCatalogItem,
  updateCatalogItem,
  deleteCatalogItem,
} from '@/lib/api/suppliers';
import type {
  SupplierSearchFilters,
  SupplierProfileFormData,
  CertificationFormData,
  CatalogItemFormData,
} from '@/types/supplier';

/*
|--------------------------------------------------------------------------
| Query Keys
|--------------------------------------------------------------------------
*/

export const supplierKeys = {
  all: ['suppliers'] as const,
  lists: () => [...supplierKeys.all, 'list'] as const,
  list: (filters: SupplierSearchFilters) =>
    [...supplierKeys.lists(), filters] as const,
  featured: () => [...supplierKeys.all, 'featured'] as const,
  recommendations: () => [...supplierKeys.all, 'recommendations'] as const,
  details: () => [...supplierKeys.all, 'detail'] as const,
  detail: (id: number) => [...supplierKeys.details(), id] as const,
  catalog: (id: number) => [...supplierKeys.all, 'catalog', id] as const,
  saved: () => [...supplierKeys.all, 'saved'] as const,
  savedCheck: (id: number) => [...supplierKeys.all, 'savedCheck', id] as const,
  profile: () => [...supplierKeys.all, 'profile'] as const,
  stats: () => [...supplierKeys.all, 'stats'] as const,
  viewsTimeline: (days: number) => [...supplierKeys.all, 'viewsTimeline', days] as const,
  activity: (limit: number) => [...supplierKeys.all, 'activity', limit] as const,
  certifications: () => [...supplierKeys.all, 'certifications'] as const,
  ownCatalog: () => [...supplierKeys.all, 'ownCatalog'] as const,
};

/*
|--------------------------------------------------------------------------
| Directory Hooks
|--------------------------------------------------------------------------
*/

/**
 * Hook to fetch paginated suppliers
 */
export function useSuppliers(filters?: SupplierSearchFilters) {
  return useQuery({
    queryKey: supplierKeys.list(filters || {}),
    queryFn: () => getSuppliers(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook for infinite scroll supplier loading
 */
export function useInfiniteSuppliers(
  filters?: Omit<SupplierSearchFilters, 'page'>
) {
  return useInfiniteQuery({
    queryKey: [...supplierKeys.lists(), { ...filters, infinite: true }] as const,
    queryFn: ({ pageParam = 1 }) => getSuppliers({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.current_page < lastPage.meta.last_page) {
        return lastPage.meta.current_page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Hook to fetch featured suppliers
 */
export function useFeaturedSuppliers(limit?: number) {
  return useQuery({
    queryKey: supplierKeys.featured(),
    queryFn: () => getFeaturedSuppliers(limit),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to fetch personalized recommendations
 */
export function useSupplierRecommendations(limit?: number) {
  return useQuery({
    queryKey: supplierKeys.recommendations(),
    queryFn: () => getSupplierRecommendations(limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch a single supplier
 */
export function useSupplier(id: number) {
  return useQuery({
    queryKey: supplierKeys.detail(id),
    queryFn: () => getSupplier(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to fetch a supplier's catalog
 */
export function useSupplierCatalog(supplierId: number) {
  return useQuery({
    queryKey: supplierKeys.catalog(supplierId),
    queryFn: () => getSupplierCatalog(supplierId),
    enabled: !!supplierId,
    staleTime: 1000 * 60 * 5,
  });
}

/*
|--------------------------------------------------------------------------
| Saved Suppliers Hooks
|--------------------------------------------------------------------------
*/

/**
 * Hook to fetch saved suppliers
 */
export function useSavedSuppliers() {
  return useQuery({
    queryKey: supplierKeys.saved(),
    queryFn: getSavedSuppliers,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Hook to check if a supplier is saved
 */
export function useSupplierSavedCheck(supplierId: number) {
  return useQuery({
    queryKey: supplierKeys.savedCheck(supplierId),
    queryFn: () => checkSupplierSaved(supplierId),
    enabled: !!supplierId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to save a supplier
 */
export function useSaveSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (supplierId: number) => saveSupplier(supplierId),
    onSuccess: (_, supplierId) => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.saved() });
      queryClient.setQueryData(supplierKeys.savedCheck(supplierId), {
        is_saved: true,
      });
      toast.success('Supplier saved');
    },
    onError: () => {
      toast.error('Failed to save supplier');
    },
  });
}

/**
 * Hook to unsave a supplier
 */
export function useUnsaveSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (supplierId: number) => unsaveSupplier(supplierId),
    onSuccess: (_, supplierId) => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.saved() });
      queryClient.setQueryData(supplierKeys.savedCheck(supplierId), {
        is_saved: false,
      });
      toast.success('Supplier removed from saved list');
    },
    onError: () => {
      toast.error('Failed to remove supplier');
    },
  });
}

/*
|--------------------------------------------------------------------------
| Supplier Profile Hooks
|--------------------------------------------------------------------------
*/

/**
 * Hook to fetch own supplier profile
 */
export function useSupplierProfile() {
  return useQuery({
    queryKey: supplierKeys.profile(),
    queryFn: getSupplierProfile,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to update supplier profile
 */
export function useUpdateSupplierProfile() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SupplierProfileFormData) => updateSupplierProfile(data),
    onSuccess: (response) => {
      queryClient.setQueryData(supplierKeys.profile(), response.data);
      queryClient.invalidateQueries({ queryKey: supplierKeys.stats() });
      toast.success('Profile updated successfully');
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });
}

/**
 * Hook to upload supplier logo
 */
export function useUploadSupplierLogo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadSupplierLogo(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.profile() });
      toast.success('Logo uploaded successfully');
    },
    onError: () => {
      toast.error('Failed to upload logo');
    },
  });
}

/**
 * Hook to fetch supplier stats
 */
export function useSupplierStats() {
  return useQuery({
    queryKey: supplierKeys.stats(),
    queryFn: getSupplierStats,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
}

/**
 * Hook to fetch supplier profile views timeline
 */
export function useSupplierViewsTimeline(days: number = 30) {
  return useQuery({
    queryKey: supplierKeys.viewsTimeline(days),
    queryFn: () => getSupplierViewsTimeline(days),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch supplier recent activity
 */
export function useSupplierActivity(limit: number = 10) {
  return useQuery({
    queryKey: supplierKeys.activity(limit),
    queryFn: () => getSupplierActivity(limit),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/*
|--------------------------------------------------------------------------
| Certification Hooks
|--------------------------------------------------------------------------
*/

/**
 * Hook to fetch supplier certifications
 */
export function useSupplierCertifications() {
  return useQuery({
    queryKey: supplierKeys.certifications(),
    queryFn: getSupplierCertifications,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to add a certification
 */
export function useAddCertification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CertificationFormData) => addCertification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.certifications() });
      queryClient.invalidateQueries({ queryKey: supplierKeys.profile() });
      queryClient.invalidateQueries({ queryKey: supplierKeys.stats() });
      toast.success('Certification added successfully');
    },
    onError: () => {
      toast.error('Failed to add certification');
    },
  });
}

/**
 * Hook to delete a certification
 */
export function useDeleteCertification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCertification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.certifications() });
      queryClient.invalidateQueries({ queryKey: supplierKeys.profile() });
      queryClient.invalidateQueries({ queryKey: supplierKeys.stats() });
      toast.success('Certification deleted');
    },
    onError: () => {
      toast.error('Failed to delete certification');
    },
  });
}

/**
 * Hook to request certification verification
 */
export function useRequestCertificationVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => requestCertificationVerification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.certifications() });
      toast.success('Verification request submitted');
    },
    onError: () => {
      toast.error('Failed to submit verification request');
    },
  });
}

/*
|--------------------------------------------------------------------------
| Catalog Hooks
|--------------------------------------------------------------------------
*/

/**
 * Hook to fetch own catalog items
 */
export function useOwnCatalog() {
  return useQuery({
    queryKey: supplierKeys.ownCatalog(),
    queryFn: getOwnCatalog,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to add a catalog item
 */
export function useAddCatalogItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CatalogItemFormData) => addCatalogItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.ownCatalog() });
      queryClient.invalidateQueries({ queryKey: supplierKeys.stats() });
      toast.success('Catalog item added');
    },
    onError: () => {
      toast.error('Failed to add catalog item');
    },
  });
}

/**
 * Hook to update a catalog item
 */
export function useUpdateCatalogItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CatalogItemFormData }) =>
      updateCatalogItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.ownCatalog() });
      toast.success('Catalog item updated');
    },
    onError: () => {
      toast.error('Failed to update catalog item');
    },
  });
}

/**
 * Hook to delete a catalog item
 */
export function useDeleteCatalogItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCatalogItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.ownCatalog() });
      queryClient.invalidateQueries({ queryKey: supplierKeys.stats() });
      toast.success('Catalog item deleted');
    },
    onError: () => {
      toast.error('Failed to delete catalog item');
    },
  });
}
