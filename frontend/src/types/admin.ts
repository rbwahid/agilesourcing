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

// Subscription Management Types

export type StripeSubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'unpaid';
export type BillingPeriod = 'monthly' | 'annual';

export interface AdminSubscription {
  id: number;
  stripe_id: string;
  stripe_status: StripeSubscriptionStatus;
  stripe_price: string;
  billing_period: BillingPeriod;
  trial_ends_at: string | null;
  ends_at: string | null;
  created_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
  };
  plan: {
    id: number;
    name: string;
    slug: string;
  } | null;
  amount: number; // Monthly amount in cents
}

export interface AdminSubscriptionInvoice {
  id: string;
  number: string;
  amount_due: number;
  amount_paid: number;
  currency: string;
  status: string;
  created: string;
  invoice_pdf: string | null;
  hosted_invoice_url: string | null;
}

export interface AdminSubscriptionDetail extends AdminSubscription {
  updated_at: string;
  on_trial: boolean;
  on_grace_period: boolean;
  cancelled: boolean;
  user: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    is_active: boolean;
    created_at: string;
  };
  plan: {
    id: number;
    name: string;
    slug: string;
    price_monthly: number;
    price_annual: number;
  } | null;
  invoices: AdminSubscriptionInvoice[];
}

export interface SubscriptionFilters {
  search?: string;
  status?: StripeSubscriptionStatus;
  plan?: string;
  billing_period?: BillingPeriod;
  sort?: 'created_at' | 'stripe_status';
  direction?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface RefundRequest {
  amount?: number; // In cents, optional for full refund
  reason: string;
}

export interface RefundResponse {
  refund_id: string;
  amount: number;
  status: string;
}

// Communication Log Types

export type CommunicationType = 'email' | 'notification';
export type CommunicationStatus = 'sent' | 'failed' | 'pending';

export interface CommunicationLog {
  id: number;
  user_id: number;
  type: CommunicationType;
  channel: string;
  subject: string;
  content: string | null;
  status: CommunicationStatus;
  metadata: Record<string, unknown> | null;
  triggered_by: {
    id: number;
    name: string;
  } | null;
  created_at: string;
}

export interface CommunicationLogFilters {
  type?: CommunicationType;
  status?: CommunicationStatus;
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
