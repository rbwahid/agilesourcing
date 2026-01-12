import { apiClient } from './client';
import type {
  InstagramStatusResponse,
  InstagramAuthResponse,
  InstagramConnection,
} from '@/types/instagram';

/**
 * Get the Instagram OAuth authorization URL
 */
export async function getInstagramAuthUrl(): Promise<InstagramAuthResponse> {
  const response = await apiClient.get<InstagramAuthResponse>('/v1/instagram/auth');
  return response.data;
}

/**
 * Get current Instagram connection status
 */
export async function getInstagramStatus(): Promise<InstagramStatusResponse> {
  const response = await apiClient.get<InstagramStatusResponse>('/v1/instagram/status');
  return response.data;
}

/**
 * Disconnect Instagram account
 */
export async function disconnectInstagram(): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>('/v1/instagram/disconnect');
  return response.data;
}

/**
 * Refresh Instagram access token
 */
export async function refreshInstagramToken(): Promise<{ message: string; data: { token_expires_at: string } }> {
  const response = await apiClient.post<{ message: string; data: { token_expires_at: string } }>(
    '/v1/instagram/refresh'
  );
  return response.data;
}
