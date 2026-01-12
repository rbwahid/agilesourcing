'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  getProfile,
  updateProfile,
  completeOnboarding,
  uploadProfileImage,
  deleteProfileImage,
} from '@/lib/api/profile';
import type { Profile, UpdateProfileData } from '@/types/profile';

/**
 * Query key for profile data
 */
export const profileKeys = {
  all: ['profile'] as const,
  detail: () => [...profileKeys.all, 'detail'] as const,
};

/**
 * Hook to fetch the current user's profile
 */
export function useProfile() {
  return useQuery({
    queryKey: profileKeys.detail(),
    queryFn: getProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
}

/**
 * Hook to update the user's profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileData) => updateProfile(data),
    onSuccess: (profile) => {
      queryClient.setQueryData(profileKeys.detail(), profile);
      // Also invalidate user query to refresh profile data there
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: () => {
      toast.error('Failed to update profile', {
        description: 'Please try again.',
      });
    },
  });
}

/**
 * Hook to complete onboarding
 */
export function useCompleteOnboarding() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: completeOnboarding,
    onSuccess: async (data) => {
      // Update the profile cache
      queryClient.setQueryData(profileKeys.detail(), data.profile);

      // Update the user cache with the new profile data
      // This ensures the dashboard shell sees the updated onboarding status
      queryClient.setQueryData(['user'], (oldUser: Record<string, unknown> | undefined) => {
        if (!oldUser) return oldUser;
        return {
          ...oldUser,
          profile: data.profile,
        };
      });

      toast.success('Welcome to AgileSourcing!', {
        description: 'Your profile is all set up.',
      });

      // Small delay to ensure cache is updated before navigation
      await new Promise((resolve) => setTimeout(resolve, 100));
      router.push('/dashboard');
    },
    onError: () => {
      toast.error('Failed to complete onboarding', {
        description: 'Please try again.',
      });
    },
  });
}

/**
 * Hook to upload profile image
 */
export function useUploadProfileImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadProfileImage(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('Profile image uploaded');
    },
    onError: () => {
      toast.error('Failed to upload image', {
        description: 'Please try again with a different image.',
      });
    },
  });
}

/**
 * Hook to delete profile image
 */
export function useDeleteProfileImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProfileImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('Profile image removed');
    },
    onError: () => {
      toast.error('Failed to remove image');
    },
  });
}

/**
 * Combined hook for profile management
 */
export function useProfileManagement() {
  const profileQuery = useProfile();
  const updateMutation = useUpdateProfile();
  const completeOnboardingMutation = useCompleteOnboarding();
  const uploadImageMutation = useUploadProfileImage();
  const deleteImageMutation = useDeleteProfileImage();

  return {
    // Profile data
    profile: profileQuery.data as Profile | undefined,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,

    // Computed states
    hasCompletedOnboarding: profileQuery.data?.has_completed_onboarding ?? false,
    isVerified: profileQuery.data?.is_verified ?? false,

    // Mutations
    updateProfile: updateMutation.mutate,
    updateProfileAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    completeOnboarding: completeOnboardingMutation.mutate,
    completeOnboardingAsync: completeOnboardingMutation.mutateAsync,
    isCompletingOnboarding: completeOnboardingMutation.isPending,

    uploadImage: uploadImageMutation.mutate,
    uploadImageAsync: uploadImageMutation.mutateAsync,
    isUploadingImage: uploadImageMutation.isPending,

    deleteImage: deleteImageMutation.mutate,
    isDeletingImage: deleteImageMutation.isPending,

    // Refetch
    refetch: profileQuery.refetch,
  };
}
