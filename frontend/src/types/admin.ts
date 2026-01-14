// Admin Dashboard Types

export interface AdminStats {
  users: {
    total: number;
    designers: number;
    suppliers: number;
    admins: number;
    active: number;
    new_today: number;
    new_this_week: number;
    new_this_month: number;
  };
  subscriptions: {
    active: number;
    trialing: number;
    cancelled: number;
    mrr: number; // in cents
  };
  verifications: {
    pending: number;
    approved_total: number;
    approved_this_week: number;
  };
  designs: {
    total: number;
    this_week: number;
    this_month: number;
  };
}

export interface SignupTrend {
  date: string;
  count: number;
}

export interface AdminActivity {
  type: 'user_registered' | 'verification_submitted' | 'subscription_changed';
  description: string;
  user_id: number;
  created_at: string;
}

// User Management Types

export type UserRole = 'designer' | 'supplier' | 'admin' | 'super_admin';
export type SubscriptionStatus = 'active' | 'trialing' | 'cancelled' | 'none';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  email_verified_at: string | null;
  created_at: string;
  last_login_at: string | null;
  subscription_status: SubscriptionStatus;
}

export interface AdminUserProfile {
  id: number;
  company_name: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  avatar_url: string | null;
  has_completed_onboarding: boolean;
}

export interface AdminUserSubscription {
  id: number;
  name: string;
  stripe_status: string;
  trial_ends_at: string | null;
  ends_at: string | null;
  created_at: string;
}

export interface AdminUserActivity {
  id: number;
  description: string;
  causer: {
    id: number;
    name: string;
  } | null;
  properties: Record<string, unknown>;
  created_at: string;
}

export interface AdminUserDetail extends AdminUser {
  profile?: AdminUserProfile;
  subscription?: AdminUserSubscription;
  recent_activity: AdminUserActivity[];
  stats: {
    designs_count?: number;
    saved_suppliers_count?: number;
    certifications_count?: number;
    verified_certifications?: number;
  };
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: UserRole;
  is_active?: boolean;
}

// User Filters

export interface UserFilters {
  search?: string;
  role?: UserRole;
  is_active?: boolean;
  sort?: 'created_at' | 'name' | 'email' | 'last_login_at';
  direction?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

// Verification Management Types

export interface VerificationSupplier {
  id: number;
  service_type: string;
  is_verified: boolean;
  profile: {
    id: number;
    company_name: string;
    location: string | null;
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
}

export interface PendingVerification {
  id: number;
  supplier_id: number;
  certification_type: string;
  certificate_url: string | null;
  expiry_date: string | null;
  is_verified: boolean;
  is_expired: boolean;
  is_expiring_soon: boolean;
  verified_at: string | null;
  created_at: string;
  supplier: VerificationSupplier;
  verifier?: {
    id: number;
    name: string;
  };
}

export interface VerificationFilters {
  certification_type?: string;
  status?: 'pending' | 'all';
  sort?: 'created_at' | 'certification_type';
  direction?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

// Audit Log Types

export interface AuditLog {
  id: number;
  log_name: string;
  description: string;
  subject_type: string;
  subject_id: number;
  causer: {
    id: number;
    name: string;
    email: string;
  } | null;
  properties: Record<string, unknown>;
  created_at: string;
}

export interface AuditLogFilters {
  causer_id?: number;
  log_name?: string;
  from?: string;
  to?: string;
  page?: number;
  per_page?: number;
}

// Paginated Response

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
