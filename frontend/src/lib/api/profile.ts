import { apiClient } from './client';
import type { Profile, UpdateProfileData } from '@/types/profile';

/**
 * Get the current user's profile
 */
export async function getProfile(): Promise<Profile> {
  const response = await apiClient.get<{ data: Profile }>('/v1/profile');
  return response.data.data;
}

/**
 * Update the current user's profile
 */
export async function updateProfile(data: UpdateProfileData): Promise<Profile> {
  const response = await apiClient.put<{ data: Profile }>('/v1/profile', data);
  return response.data.data;
}

/**
 * Mark onboarding as complete
 */
export async function completeOnboarding(): Promise<{ message: string; profile: Profile }> {
  const response = await apiClient.post<{ message: string; profile: { data: Profile } }>(
    '/v1/profile/complete-onboarding'
  );
  return {
    message: response.data.message,
    profile: response.data.profile.data,
  };
}

/**
 * Upload profile image
 */
export async function uploadProfileImage(
  file: File
): Promise<{ message: string; profile_image_path: string; profile_image_url: string }> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await apiClient.post<{
    message: string;
    profile_image_path: string;
    profile_image_url: string;
  }>('/v1/profile/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

/**
 * Delete profile image
 */
export async function deleteProfileImage(): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>('/v1/profile/image');
  return response.data;
}
