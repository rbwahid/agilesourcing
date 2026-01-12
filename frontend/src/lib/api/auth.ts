import { apiClient, getCsrfToken } from './client';
import type { User } from '@/types';

/**
 * Auth API Types
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: 'designer' | 'supplier';
}

export interface ResetPasswordData {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: User;
  message?: string;
}

/**
 * Login user
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  // Fetch CSRF token first
  await getCsrfToken();

  const response = await apiClient.post<AuthResponse>('/login', credentials);
  return response.data;
}

/**
 * Register new user
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  // Fetch CSRF token first
  await getCsrfToken();

  const response = await apiClient.post<AuthResponse>('/register', data);
  return response.data;
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  await apiClient.post('/logout');
}

/**
 * Get current authenticated user
 */
export async function getUser(): Promise<User> {
  const response = await apiClient.get<User>('/user');
  return response.data;
}

/**
 * Send password reset email
 */
export async function forgotPassword(email: string): Promise<{ message: string }> {
  await getCsrfToken();

  const response = await apiClient.post<{ message: string }>('/forgot-password', { email });
  return response.data;
}

/**
 * Reset password with token
 */
export async function resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
  await getCsrfToken();

  const response = await apiClient.post<{ message: string }>('/reset-password', data);
  return response.data;
}

/**
 * Resend email verification
 */
export async function resendVerification(): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>('/email/verification-notification');
  return response.data;
}

/**
 * Verify email with signed URL
 */
export async function verifyEmail(url: string): Promise<void> {
  await apiClient.get(url);
}
