'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getAdminStats,
  getSignupTrends,
  getRecentActivity,
  getAdminUsers,
  getAdminUser,
  updateAdminUser,
  suspendUser,
  reactivateUser,
  getPendingVerifications,
  getVerificationTypes,
  getVerification,
  approveVerification,
  rejectVerification,
  getAuditLogs,
  getAdminSubscriptions,
  getAdminSubscription,
  retrySubscriptionPayment,
  createRefund,
  getUserCommunications,
} from '@/lib/api/admin';
import type {
  UserFilters,
  UpdateUserData,
  VerificationFilters,
  AuditLogFilters,
  SubscriptionFilters,
  RefundRequest,
  CommunicationLogFilters,
} from '@/types/admin';

// ============================================================================
// Query Keys
// ============================================================================

export const adminKeys = {
  all: ['admin'] as const,
  stats: () => [...adminKeys.all, 'stats'] as const,
  signupTrends: (days: number) => [...adminKeys.all, 'signup-trends', days] as const,
  recentActivity: (limit: number) => [...adminKeys.all, 'recent-activity', limit] as const,
  users: () => [...adminKeys.all, 'users'] as const,
  usersList: (filters: UserFilters) => [...adminKeys.users(), 'list', filters] as const,
  user: (id: number) => [...adminKeys.users(), 'detail', id] as const,
  userCommunications: (userId: number, filters: CommunicationLogFilters) =>
    [...adminKeys.users(), userId, 'communications', filters] as const,
  verifications: () => [...adminKeys.all, 'verifications'] as const,
  verificationsList: (filters: VerificationFilters) =>
    [...adminKeys.verifications(), 'list', filters] as const,
  verificationTypes: () => [...adminKeys.verifications(), 'types'] as const,
  verification: (id: number) => [...adminKeys.verifications(), 'detail', id] as const,
  auditLogs: (filters: AuditLogFilters) => [...adminKeys.all, 'audit-logs', filters] as const,
  subscriptions: () => [...adminKeys.all, 'subscriptions'] as const,
  subscriptionsList: (filters: SubscriptionFilters) =>
    [...adminKeys.subscriptions(), 'list', filters] as const,
  subscription: (id: number) => [...adminKeys.subscriptions(), 'detail', id] as const,
};

// ============================================================================
// Dashboard Stats Hooks
// ============================================================================

/**
 * Fetch admin dashboard statistics.
 */
export function useAdminStats() {
  return useQuery({
    queryKey: adminKeys.stats(),
    queryFn: getAdminStats,
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Fetch signup trends.
 */
export function useSignupTrends(days: number = 30) {
  return useQuery({
    queryKey: adminKeys.signupTrends(days),
    queryFn: () => getSignupTrends(days),
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Fetch recent activity.
 */
export function useRecentActivity(limit: number = 10) {
  return useQuery({
    queryKey: adminKeys.recentActivity(limit),
    queryFn: () => getRecentActivity(limit),
    staleTime: 30 * 1000, // 30 seconds
  });
}

// ============================================================================
// User Management Hooks
// ============================================================================

/**
 * Fetch paginated users list with filters.
 */
export function useAdminUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: adminKeys.usersList(filters),
    queryFn: () => getAdminUsers(filters),
    staleTime: 30 * 1000,
  });
}

/**
 * Fetch single user details.
 */
export function useAdminUser(id: number) {
  return useQuery({
    queryKey: adminKeys.user(id),
    queryFn: () => getAdminUser(id),
    enabled: !!id,
  });
}

/**
 * Update user mutation.
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserData }) =>
      updateAdminUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.user(id) });
      toast.success('User updated successfully');
    },
    onError: () => {
      toast.error('Failed to update user');
    },
  });
}

/**
 * Suspend user mutation.
 */
export function useSuspendUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: suspendUser,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.user(id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
      toast.success('User suspended successfully');
    },
    onError: () => {
      toast.error('Failed to suspend user');
    },
  });
}

/**
 * Reactivate user mutation.
 */
export function useReactivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reactivateUser,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.user(id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
      toast.success('User reactivated successfully');
    },
    onError: () => {
      toast.error('Failed to reactivate user');
    },
  });
}

// ============================================================================
// Verification Management Hooks
// ============================================================================

/**
 * Fetch paginated verifications list.
 */
export function usePendingVerifications(filters: VerificationFilters = {}) {
  return useQuery({
    queryKey: adminKeys.verificationsList(filters),
    queryFn: () => getPendingVerifications(filters),
    staleTime: 30 * 1000,
  });
}

/**
 * Fetch certification types.
 */
export function useVerificationTypes() {
  return useQuery({
    queryKey: adminKeys.verificationTypes(),
    queryFn: getVerificationTypes,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch single verification details.
 */
export function useVerification(id: number) {
  return useQuery({
    queryKey: adminKeys.verification(id),
    queryFn: () => getVerification(id),
    enabled: !!id,
  });
}

/**
 * Approve verification mutation.
 */
export function useApproveVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveVerification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.verifications() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
      toast.success('Certification approved successfully');
    },
    onError: () => {
      toast.error('Failed to approve certification');
    },
  });
}

/**
 * Reject verification mutation.
 */
export function useRejectVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, feedback }: { id: number; feedback: string }) =>
      rejectVerification(id, feedback),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.verifications() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
      toast.success('Certification rejected. Supplier has been notified.');
    },
    onError: () => {
      toast.error('Failed to reject certification');
    },
  });
}

// ============================================================================
// Audit Log Hooks
// ============================================================================

/**
 * Fetch paginated audit logs.
 */
export function useAuditLogs(filters: AuditLogFilters = {}) {
  return useQuery({
    queryKey: adminKeys.auditLogs(filters),
    queryFn: () => getAuditLogs(filters),
    staleTime: 30 * 1000,
  });
}

// ============================================================================
// Subscription Management Hooks
// ============================================================================

/**
 * Fetch paginated subscriptions list with filters.
 */
export function useAdminSubscriptions(filters: SubscriptionFilters = {}) {
  return useQuery({
    queryKey: adminKeys.subscriptionsList(filters),
    queryFn: () => getAdminSubscriptions(filters),
    staleTime: 30 * 1000,
  });
}

/**
 * Fetch single subscription details with invoices.
 */
export function useAdminSubscription(id: number) {
  return useQuery({
    queryKey: adminKeys.subscription(id),
    queryFn: () => getAdminSubscription(id),
    enabled: !!id,
  });
}

/**
 * Retry payment mutation for past_due subscriptions.
 */
export function useRetryPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: retrySubscriptionPayment,
    onSuccess: (_, subscriptionId) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.subscriptions() });
      queryClient.invalidateQueries({ queryKey: adminKeys.subscription(subscriptionId) });
      toast.success('Payment retry initiated successfully');
    },
    onError: () => {
      toast.error('Failed to retry payment');
    },
  });
}

/**
 * Create refund mutation.
 */
export function useCreateRefund() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ invoiceId, data }: { invoiceId: string; data: RefundRequest }) =>
      createRefund(invoiceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.subscriptions() });
      toast.success('Refund processed successfully');
    },
    onError: () => {
      toast.error('Failed to process refund');
    },
  });
}

// ============================================================================
// Customer Support Hooks
// ============================================================================

/**
 * Fetch communication logs for a user.
 */
export function useUserCommunications(userId: number, filters: CommunicationLogFilters = {}) {
  return useQuery({
    queryKey: adminKeys.userCommunications(userId, filters),
    queryFn: () => getUserCommunications(userId, filters),
    enabled: !!userId,
    staleTime: 30 * 1000,
  });
}
