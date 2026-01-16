import { apiClient } from './client';
import type {
  AdminStats,
  AdminUser,
  AdminUserDetail,
  AdminActivity,
  SignupTrend,
  UpdateUserData,
  UserFilters,
  PendingVerification,
  VerificationFilters,
  AuditLog,
  AuditLogFilters,
  PaginatedResponse,
  AdminSubscription,
  AdminSubscriptionDetail,
  SubscriptionFilters,
  RefundRequest,
  RefundResponse,
  CommunicationLog,
  CommunicationLogFilters,
  AdminPlan,
  UpdatePlanData,
  StripeSyncResult,
  ToggleActiveResult,
} from '@/types/admin';

// ============================================================================
// Dashboard Stats
// ============================================================================

/**
 * Get admin dashboard statistics.
 */
export async function getAdminStats(): Promise<AdminStats> {
  const response = await apiClient.get<{ data: AdminStats }>('/v1/admin/stats');
  return response.data.data;
}

/**
 * Get signup trends for the specified number of days.
 */
export async function getSignupTrends(days: number = 30): Promise<SignupTrend[]> {
  const response = await apiClient.get<{ data: SignupTrend[] }>('/v1/admin/signup-trends', {
    params: { days },
  });
  return response.data.data;
}

/**
 * Get recent platform activity.
 */
export async function getRecentActivity(limit: number = 10): Promise<AdminActivity[]> {
  const response = await apiClient.get<{ data: AdminActivity[] }>('/v1/admin/recent-activity', {
    params: { limit },
  });
  return response.data.data;
}

// ============================================================================
// User Management
// ============================================================================

/**
 * Get paginated list of users with filters.
 */
export async function getAdminUsers(
  filters: UserFilters = {}
): Promise<PaginatedResponse<AdminUser>> {
  const response = await apiClient.get<PaginatedResponse<AdminUser>>('/v1/admin/users', {
    params: filters,
  });
  return response.data;
}

/**
 * Get detailed user information.
 */
export async function getAdminUser(id: number): Promise<AdminUserDetail> {
  const response = await apiClient.get<{ data: AdminUserDetail }>(`/v1/admin/users/${id}`);
  return response.data.data;
}

/**
 * Update user details.
 */
export async function updateAdminUser(
  id: number,
  data: UpdateUserData
): Promise<AdminUser> {
  const response = await apiClient.put<{ data: AdminUser; message: string }>(
    `/v1/admin/users/${id}`,
    data
  );
  return response.data.data;
}

/**
 * Suspend a user account.
 */
export async function suspendUser(id: number): Promise<AdminUser> {
  const response = await apiClient.post<{ data: AdminUser; message: string }>(
    `/v1/admin/users/${id}/suspend`
  );
  return response.data.data;
}

/**
 * Reactivate a suspended user account.
 */
export async function reactivateUser(id: number): Promise<AdminUser> {
  const response = await apiClient.post<{ data: AdminUser; message: string }>(
    `/v1/admin/users/${id}/reactivate`
  );
  return response.data.data;
}

// ============================================================================
// Verification Management
// ============================================================================

/**
 * Get paginated list of verifications.
 */
export async function getPendingVerifications(
  filters: VerificationFilters = {}
): Promise<PaginatedResponse<PendingVerification>> {
  const response = await apiClient.get<PaginatedResponse<PendingVerification>>(
    '/v1/admin/verifications',
    { params: filters }
  );
  return response.data;
}

/**
 * Get certification types for filtering.
 */
export async function getVerificationTypes(): Promise<string[]> {
  const response = await apiClient.get<{ data: string[] }>('/v1/admin/verifications/types');
  return response.data.data;
}

/**
 * Get detailed verification information.
 */
export async function getVerification(id: number): Promise<PendingVerification> {
  const response = await apiClient.get<{ data: PendingVerification }>(
    `/v1/admin/verifications/${id}`
  );
  return response.data.data;
}

/**
 * Approve a certification.
 */
export async function approveVerification(id: number): Promise<PendingVerification> {
  const response = await apiClient.post<{ data: PendingVerification; message: string }>(
    `/v1/admin/verifications/${id}/approve`
  );
  return response.data.data;
}

/**
 * Reject a certification with feedback.
 */
export async function rejectVerification(id: number, feedback: string): Promise<void> {
  await apiClient.post(`/v1/admin/verifications/${id}/reject`, { feedback });
}

// ============================================================================
// Audit Logs
// ============================================================================

/**
 * Get paginated audit logs.
 */
export async function getAuditLogs(
  filters: AuditLogFilters = {}
): Promise<PaginatedResponse<AuditLog>> {
  const response = await apiClient.get<PaginatedResponse<AuditLog>>('/v1/admin/audit-logs', {
    params: filters,
  });
  return response.data;
}

// ============================================================================
// Subscription Management
// ============================================================================

/**
 * Get paginated list of subscriptions with filters.
 */
export async function getAdminSubscriptions(
  filters: SubscriptionFilters = {}
): Promise<PaginatedResponse<AdminSubscription>> {
  const response = await apiClient.get<PaginatedResponse<AdminSubscription>>(
    '/v1/admin/subscriptions',
    { params: filters }
  );
  return response.data;
}

/**
 * Get detailed subscription information including invoices.
 */
export async function getAdminSubscription(id: number): Promise<AdminSubscriptionDetail> {
  const response = await apiClient.get<{ data: AdminSubscriptionDetail }>(
    `/v1/admin/subscriptions/${id}`
  );
  return response.data.data;
}

/**
 * Retry a failed payment for a subscription.
 */
export async function retrySubscriptionPayment(subscriptionId: number): Promise<void> {
  await apiClient.post(`/v1/admin/subscriptions/${subscriptionId}/retry`);
}

/**
 * Create a refund for an invoice.
 */
export async function createRefund(
  invoiceId: string,
  data: RefundRequest
): Promise<RefundResponse> {
  const response = await apiClient.post<{ data: RefundResponse; message: string }>(
    `/v1/admin/invoices/${invoiceId}/refund`,
    data
  );
  return response.data.data;
}

// ============================================================================
// Customer Support
// ============================================================================

/**
 * Get communication logs for a specific user.
 */
export async function getUserCommunications(
  userId: number,
  filters: CommunicationLogFilters = {}
): Promise<PaginatedResponse<CommunicationLog>> {
  const response = await apiClient.get<PaginatedResponse<CommunicationLog>>(
    `/v1/admin/users/${userId}/communications`,
    { params: filters }
  );
  return response.data;
}

// ============================================================================
// Plan Management
// ============================================================================

/**
 * Get all plans (including inactive).
 */
export async function getAdminPlans(): Promise<AdminPlan[]> {
  const response = await apiClient.get<{ data: AdminPlan[] }>('/v1/admin/plans');
  return response.data.data;
}

/**
 * Get a single plan by ID.
 */
export async function getAdminPlan(id: number): Promise<AdminPlan> {
  const response = await apiClient.get<{ data: AdminPlan }>(`/v1/admin/plans/${id}`);
  return response.data.data;
}

/**
 * Update a plan.
 */
export async function updatePlan(id: number, data: UpdatePlanData): Promise<AdminPlan> {
  const response = await apiClient.put<{ data: AdminPlan }>(`/v1/admin/plans/${id}`, data);
  return response.data.data;
}

/**
 * Toggle plan active status.
 */
export async function togglePlanActive(id: number): Promise<ToggleActiveResult> {
  const response = await apiClient.post<ToggleActiveResult>(`/v1/admin/plans/${id}/toggle-active`);
  return response.data;
}

/**
 * Sync plan with Stripe (create/update product and prices).
 */
export async function syncPlanWithStripe(id: number): Promise<StripeSyncResult> {
  const response = await apiClient.post<StripeSyncResult>(`/v1/admin/plans/${id}/sync-stripe`);
  return response.data;
}
