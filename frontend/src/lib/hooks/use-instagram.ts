'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getInstagramAuthUrl,
  getInstagramStatus,
  disconnectInstagram,
  refreshInstagramToken,
} from '@/lib/api/instagram';

/**
 * Query keys for Instagram
 */
export const instagramKeys = {
  all: ['instagram'] as const,
  status: () => [...instagramKeys.all, 'status'] as const,
};

/**
 * Hook to get Instagram connection status
 */
export function useInstagramStatus() {
  return useQuery({
    queryKey: instagramKeys.status(),
    queryFn: getInstagramStatus,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to initiate Instagram connection
 */
export function useConnectInstagram() {
  return useMutation({
    mutationFn: getInstagramAuthUrl,
    onSuccess: (response) => {
      // Redirect to Instagram OAuth
      window.location.href = response.url;
    },
    onError: () => {
      toast.error('Failed to connect Instagram', {
        description: 'Please try again.',
      });
    },
  });
}

/**
 * Hook to disconnect Instagram account
 */
export function useDisconnectInstagram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: disconnectInstagram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: instagramKeys.status() });
      toast.success('Instagram disconnected', {
        description: 'Your Instagram account has been unlinked.',
      });
    },
    onError: () => {
      toast.error('Failed to disconnect Instagram', {
        description: 'Please try again.',
      });
    },
  });
}

/**
 * Hook to refresh Instagram token
 */
export function useRefreshInstagramToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refreshInstagramToken,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: instagramKeys.status() });
      toast.success('Token refreshed', {
        description: 'Your Instagram connection has been renewed.',
      });
    },
    onError: () => {
      toast.error('Failed to refresh token', {
        description: 'Please reconnect your Instagram account.',
      });
    },
  });
}
