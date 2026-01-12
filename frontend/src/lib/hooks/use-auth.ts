'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  login,
  register,
  logout,
  getUser,
  forgotPassword,
  resetPassword,
  type LoginCredentials,
  type RegisterData,
  type ResetPasswordData,
} from '@/lib/api/auth';
import type { User } from '@/types';

/**
 * Query key for user data
 */
export const userQueryKey = ['user'] as const;

/**
 * Hook to get current user
 */
export function useUser() {
  return useQuery({
    queryKey: userQueryKey,
    queryFn: getUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for login mutation
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(userQueryKey, data.user);
      toast.success('Welcome back!', {
        description: `Logged in as ${data.user.email}`,
      });

      // Redirect based on role
      if (data.user.role === 'admin' || data.user.role === 'super_admin') {
        router.push('/admin-dashboard');
      } else if (data.user.role === 'supplier') {
        router.push('/supplier-dashboard');
      } else if (data.user.role === 'designer') {
        // Check if onboarding is completed
        if (data.user.profile?.has_completed_onboarding) {
          router.push('/dashboard');
        } else {
          router.push('/onboarding');
        }
      } else {
        router.push('/dashboard');
      }
    },
  });
}

/**
 * Hook for register mutation
 */
export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterData) => register(data),
    onSuccess: (data) => {
      queryClient.setQueryData(userQueryKey, data.user);
      toast.success('Account created!', {
        description: 'Welcome! Let\'s set up your profile.',
      });

      // Redirect based on role - designers go to onboarding
      if (data.user.role === 'designer') {
        router.push('/onboarding');
      } else if (data.user.role === 'supplier') {
        router.push('/supplier-dashboard');
      } else {
        router.push('/dashboard');
      }
    },
  });
}

/**
 * Hook for logout mutation
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(userQueryKey, null);
      queryClient.clear();
      toast.success('Logged out successfully');
      router.push('/login');
    },
  });
}

/**
 * Hook for forgot password mutation
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
    onSuccess: () => {
      toast.success('Password reset email sent', {
        description: 'Check your email for the reset link',
      });
    },
  });
}

/**
 * Hook for reset password mutation
 */
export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ResetPasswordData) => resetPassword(data),
    onSuccess: () => {
      toast.success('Password reset successfully', {
        description: 'You can now log in with your new password',
      });
      router.push('/login');
    },
  });
}

/**
 * Combined auth hook with common auth state and actions
 */
export function useAuth() {
  const { data: user, isLoading, error } = useUser();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    isDesigner: user?.role === 'designer',
    isSupplier: user?.role === 'supplier',
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
