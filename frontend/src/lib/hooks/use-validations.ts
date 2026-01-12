'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  getValidations,
  getValidation,
  createValidation,
  cancelValidation,
  getValidationMetrics,
} from '@/lib/api/validations';
import type { CreateValidationData, ValidationFilters } from '@/types/validation';

/**
 * Query keys for validations
 */
export const validationKeys = {
  all: ['validations'] as const,
  lists: () => [...validationKeys.all, 'list'] as const,
  list: (filters: ValidationFilters) => [...validationKeys.lists(), filters] as const,
  details: () => [...validationKeys.all, 'detail'] as const,
  detail: (id: number) => [...validationKeys.details(), id] as const,
  metrics: (id: number) => [...validationKeys.all, 'metrics', id] as const,
};

/**
 * Hook to fetch paginated validations
 */
export function useValidations(filters?: ValidationFilters) {
  return useQuery({
    queryKey: validationKeys.list(filters || {}),
    queryFn: () => getValidations(filters),
    staleTime: 1000 * 60, // 1 minute
  });
}

/**
 * Hook to fetch a single validation
 */
export function useValidation(id: number) {
  return useQuery({
    queryKey: validationKeys.detail(id),
    queryFn: () => getValidation(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook for polling validation status updates
 */
export function useValidationPolling(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: validationKeys.detail(id),
    queryFn: () => getValidation(id),
    enabled: options?.enabled !== false && !!id,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // Poll every 30 seconds while pending or active
      if (status === 'pending' || status === 'active') {
        return 30000;
      }
      return false;
    },
  });
}

/**
 * Hook to fetch validation metrics with polling
 */
export function useValidationMetrics(id: number, options?: { pollingEnabled?: boolean }) {
  return useQuery({
    queryKey: validationKeys.metrics(id),
    queryFn: () => getValidationMetrics(id),
    enabled: !!id,
    refetchInterval: (query) => {
      // Poll every minute while validation is active
      if (options?.pollingEnabled !== false) {
        const data = query.state.data;
        if (data && !data.has_ended) {
          return 60000; // 1 minute
        }
      }
      return false;
    },
  });
}

/**
 * Hook to create a new validation
 */
export function useCreateValidation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateValidationData) => createValidation(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: validationKeys.lists() });

      toast.success('Validation started', {
        description: 'Your design will be posted to Instagram shortly.',
      });

      // Navigate to the validation detail page
      router.push(`/validations/${response.data.id}`);
    },
    onError: (error: any) => {
      toast.error('Failed to start validation', {
        description: error?.response?.data?.message || 'Please try again.',
      });
    },
  });
}

/**
 * Hook to cancel a validation
 */
export function useCancelValidation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelValidation,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: validationKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: validationKeys.lists() });

      toast.success('Validation cancelled');
    },
    onError: (error: any) => {
      toast.error('Failed to cancel validation', {
        description: error?.response?.data?.message || 'Please try again.',
      });
    },
  });
}

/**
 * Hook to get active validation count (for navigation badge)
 */
export function useActiveValidationsCount() {
  const { data } = useValidations({ status: 'active' });
  return data?.meta?.total ?? 0;
}
