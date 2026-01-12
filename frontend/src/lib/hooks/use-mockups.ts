'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getMockups,
  getMockup,
  createMockup,
  deleteMockup,
} from '@/lib/api/mockups';
import type { MockupOptions } from '@/types/instagram';
import { designKeys } from './use-designs';

/**
 * Query keys for mockups
 */
export const mockupKeys = {
  all: ['mockups'] as const,
  lists: () => [...mockupKeys.all, 'list'] as const,
  list: (designId: number) => [...mockupKeys.lists(), designId] as const,
  details: () => [...mockupKeys.all, 'detail'] as const,
  detail: (id: number) => [...mockupKeys.details(), id] as const,
};

/**
 * Hook to fetch mockups for a design
 */
export function useMockups(designId: number) {
  return useQuery({
    queryKey: mockupKeys.list(designId),
    queryFn: () => getMockups(designId),
    enabled: !!designId,
    staleTime: 1000 * 30, // 30 seconds (mockups can change status frequently)
  });
}

/**
 * Hook to fetch a single mockup with polling for status updates
 */
export function useMockup(mockupId: number, options?: { pollingEnabled?: boolean }) {
  return useQuery({
    queryKey: mockupKeys.detail(mockupId),
    queryFn: () => getMockup(mockupId),
    enabled: !!mockupId,
    refetchInterval: (query) => {
      // Poll every 3 seconds while processing
      if (options?.pollingEnabled !== false) {
        const status = query.state.data?.status;
        if (status === 'pending' || status === 'processing') {
          return 3000;
        }
      }
      return false;
    },
  });
}

/**
 * Hook to create a mockup for a design
 */
export function useCreateMockup(designId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: MockupOptions) => createMockup(designId, options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mockupKeys.list(designId) });
      queryClient.invalidateQueries({ queryKey: designKeys.detail(designId) });

      toast.success('Mockup generation started', {
        description: 'This may take up to a minute.',
      });
    },
    onError: (error: any) => {
      toast.error('Failed to generate mockup', {
        description: error?.response?.data?.message || 'Please try again.',
      });
    },
  });
}

/**
 * Hook to delete a mockup
 */
export function useDeleteMockup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMockup,
    onSuccess: () => {
      // Invalidate all mockup queries since we don't know which design it belonged to
      queryClient.invalidateQueries({ queryKey: mockupKeys.all });

      toast.success('Mockup deleted');
    },
    onError: (error: any) => {
      toast.error('Failed to delete mockup', {
        description: error?.response?.data?.message || 'Please try again.',
      });
    },
  });
}

/**
 * Hook for polling mockups for a design (useful when generating)
 */
export function useMockupsPolling(designId: number, enabled: boolean = true) {
  return useQuery({
    queryKey: mockupKeys.list(designId),
    queryFn: () => getMockups(designId),
    enabled: !!designId && enabled,
    refetchInterval: (query) => {
      // Poll if any mockup is still processing
      const mockups = query.state.data;
      const isProcessing = mockups?.some(
        (m) => m.status === 'pending' || m.status === 'processing'
      );
      if (isProcessing) {
        return 3000;
      }
      return false;
    },
  });
}
