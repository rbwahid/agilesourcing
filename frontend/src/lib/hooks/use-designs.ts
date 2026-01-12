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
  getDesigns,
  getDesign,
  createDesign,
  updateDesign,
  deleteDesign,
  getDesignStats,
  triggerAnalysis,
  generateVariations,
  regenerateVariations,
} from '@/lib/api/designs';
import type {
  Design,
  CreateDesignData,
  UpdateDesignData,
  DesignFilters,
  DesignStatus,
} from '@/types/design';

/**
 * Query keys for designs
 */
export const designKeys = {
  all: ['designs'] as const,
  lists: () => [...designKeys.all, 'list'] as const,
  list: (filters: DesignFilters) => [...designKeys.lists(), filters] as const,
  details: () => [...designKeys.all, 'detail'] as const,
  detail: (id: number) => [...designKeys.details(), id] as const,
  stats: () => [...designKeys.all, 'stats'] as const,
};

/**
 * Hook to fetch paginated designs
 */
export function useDesigns(filters?: DesignFilters) {
  return useQuery({
    queryKey: designKeys.list(filters || {}),
    queryFn: () => getDesigns(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook for infinite scroll design loading
 */
export function useInfiniteDesigns(filters?: Omit<DesignFilters, 'page'>) {
  return useInfiniteQuery({
    queryKey: [...designKeys.lists(), { ...filters, infinite: true }] as const,
    queryFn: ({ pageParam = 1 }) => getDesigns({ ...filters, page: pageParam }),
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
 * Hook to fetch a single design
 */
export function useDesign(id: number) {
  return useQuery({
    queryKey: designKeys.detail(id),
    queryFn: () => getDesign(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch design statistics
 */
export function useDesignStats() {
  return useQuery({
    queryKey: designKeys.stats(),
    queryFn: getDesignStats,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
}

/**
 * Hook to create a new design
 */
export function useCreateDesign() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateDesignData) => createDesign(data),
    onSuccess: (response) => {
      // Invalidate and refetch designs list
      queryClient.invalidateQueries({ queryKey: designKeys.lists() });
      queryClient.invalidateQueries({ queryKey: designKeys.stats() });

      toast.success('Design uploaded successfully!', {
        description: 'Your design has been saved.',
      });

      // Navigate to the new design's detail page
      router.push(`/designs/${response.data.id}`);
    },
    onError: () => {
      toast.error('Failed to upload design', {
        description: 'Please try again.',
      });
    },
  });
}

/**
 * Hook to update a design
 */
export function useUpdateDesign(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateDesignData) => updateDesign(id, data),
    onSuccess: (response) => {
      // Update cache
      queryClient.setQueryData(designKeys.detail(id), response.data);
      queryClient.invalidateQueries({ queryKey: designKeys.lists() });

      toast.success('Design updated');
    },
    onError: () => {
      toast.error('Failed to update design');
    },
  });
}

/**
 * Hook to delete a design
 */
export function useDeleteDesign() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: number) => deleteDesign(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: designKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: designKeys.lists() });
      queryClient.invalidateQueries({ queryKey: designKeys.stats() });

      toast.success('Design deleted');
      router.push('/designs');
    },
    onError: () => {
      toast.error('Failed to delete design');
    },
  });
}

/**
 * Hook to update design status
 */
export function useUpdateDesignStatus(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: DesignStatus) => updateDesign(id, { status }),
    onSuccess: (response) => {
      queryClient.setQueryData(designKeys.detail(id), response.data);
      queryClient.invalidateQueries({ queryKey: designKeys.lists() });
      queryClient.invalidateQueries({ queryKey: designKeys.stats() });

      const statusMessages: Record<DesignStatus, string> = {
        active: 'Design is now active',
        archived: 'Design has been archived',
        draft: 'Design moved to drafts',
      };
      toast.success(statusMessages[response.data.status]);
    },
    onError: () => {
      toast.error('Failed to update status');
    },
  });
}

/**
 * Combined hook for design management
 */
export function useDesignManagement(id: number) {
  const designQuery = useDesign(id);
  const updateMutation = useUpdateDesign(id);
  const deleteMutation = useDeleteDesign();
  const statusMutation = useUpdateDesignStatus(id);

  return {
    // Design data
    design: designQuery.data,
    isLoading: designQuery.isLoading,
    isError: designQuery.isError,
    error: designQuery.error,

    // Mutations
    updateDesign: updateMutation.mutate,
    updateDesignAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    deleteDesign: () => deleteMutation.mutate(id),
    isDeleting: deleteMutation.isPending,

    updateStatus: statusMutation.mutate,
    isUpdatingStatus: statusMutation.isPending,

    // Refetch
    refetch: designQuery.refetch,
  };
}

/**
 * Hook to trigger AI analysis for a design
 */
export function useTriggerAnalysis(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => triggerAnalysis(id),
    onSuccess: (response) => {
      queryClient.setQueryData(designKeys.detail(id), response.data);
      toast.success('AI analysis started', {
        description: 'Your design is being analyzed.',
      });
    },
    onError: () => {
      toast.error('Failed to start analysis', {
        description: 'Please try again.',
      });
    },
  });
}

/**
 * Hook to generate variations for a design
 */
export function useGenerateVariations(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (count?: number) => generateVariations(id, count),
    onSuccess: (response) => {
      queryClient.setQueryData(designKeys.detail(id), response.data);
      queryClient.invalidateQueries({ queryKey: designKeys.detail(id) });
      toast.success('Variations queued', {
        description: 'Your design variations are being generated.',
      });
    },
    onError: () => {
      toast.error('Failed to generate variations', {
        description: 'Please try again.',
      });
    },
  });
}

/**
 * Hook to regenerate variations for a design
 */
export function useRegenerateVariations(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (count?: number) => regenerateVariations(id, count),
    onSuccess: (response) => {
      queryClient.setQueryData(designKeys.detail(id), response.data);
      queryClient.invalidateQueries({ queryKey: designKeys.detail(id) });
      toast.success('Regenerating variations', {
        description: 'New variations are being generated.',
      });
    },
    onError: () => {
      toast.error('Failed to regenerate variations', {
        description: 'Please try again.',
      });
    },
  });
}
