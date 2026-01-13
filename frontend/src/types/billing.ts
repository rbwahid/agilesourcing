// Plan types
export interface Plan {
  id: number;
  name: string;
  slug: string;
  user_type: 'designer' | 'supplier';
  price_monthly: number;
  price_annual: number;
  features: string[];
  design_uploads_limit: number | null;
  validations_limit: number | null;
  has_unlimited_uploads: boolean;
  has_unlimited_validations: boolean;
  is_active: boolean;
}

// Subscription types
export interface Subscription {
  id: number;
  stripe_id: string;
  status: SubscriptionStatus;
  plan: Plan | null;
  stripe_price: string;
  billing_period: BillingPeriod;
  current_period_start: string | null;
  current_period_end: string | null;
  trial_ends_at: string | null;
  ends_at: string | null;
  on_trial: boolean;
  on_grace_period: boolean;
  cancel_at_period_end: boolean;
}

export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'paused'
  | 'trialing'
  | 'unpaid'
  | 'inactive';

export type BillingPeriod = 'monthly' | 'annual';

// Payment method types
export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
}

// Invoice types
export interface Invoice {
  id: string;
  number: string;
  amount_due: number;
  amount_paid: number;
  currency: string;
  status: InvoiceStatus;
  created: string;
  period_start: string | null;
  period_end: string | null;
  invoice_pdf: string | null;
  hosted_invoice_url: string | null;
}

export type InvoiceStatus = 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';

// Upcoming invoice preview
export interface UpcomingInvoice {
  amount_due: number;
  currency: string;
  next_payment_date: string | null;
  line_items: InvoiceLineItem[];
}

export interface InvoiceLineItem {
  description: string;
  amount: number;
  quantity: number;
}

// Usage types
export interface SubscriptionUsage {
  design_uploads: UsageMetric;
  validations: UsageMetric;
  billing_period_start: string | null;
  billing_period_end: string | null;
}

export interface UsageMetric {
  used: number;
  limit: number | null;
}

// API request types
export interface CreateSubscriptionData {
  plan_slug: string;
  payment_method_id?: string;
  billing_period: BillingPeriod;
}

export interface AddPaymentMethodData {
  payment_method_id: string;
  set_as_default?: boolean;
}

// Stripe setup intent response
export interface SetupIntentResponse {
  client_secret: string;
}

// Helpers
export const SUBSCRIPTION_STATUS_CONFIG: Record<
  SubscriptionStatus,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  active: {
    label: 'Active',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  trialing: {
    label: 'Trial',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  canceled: {
    label: 'Canceled',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
  past_due: {
    label: 'Past Due',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  unpaid: {
    label: 'Unpaid',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  incomplete: {
    label: 'Incomplete',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  incomplete_expired: {
    label: 'Expired',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
  paused: {
    label: 'Paused',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  inactive: {
    label: 'No Subscription',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
};

export const INVOICE_STATUS_CONFIG: Record<
  InvoiceStatus,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  draft: {
    label: 'Draft',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
  open: {
    label: 'Open',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  paid: {
    label: 'Paid',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  void: {
    label: 'Void',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
  uncollectible: {
    label: 'Uncollectible',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
};

export const CARD_BRAND_ICONS: Record<string, string> = {
  visa: '💳',
  mastercard: '💳',
  amex: '💳',
  discover: '💳',
  diners: '💳',
  jcb: '💳',
  unionpay: '💳',
  unknown: '💳',
};

// Format currency
export function formatCurrency(amount: number, currency = 'USD'): string {
  // If amount is in cents (Stripe format), convert to dollars
  const dollars = amount >= 100 ? amount / 100 : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(dollars);
}

// Format billing period
export function formatBillingPeriod(period: BillingPeriod): string {
  return period === 'annual' ? 'Yearly' : 'Monthly';
}

// Calculate annual savings percentage
export function calculateAnnualSavings(monthly: number, annual: number): number {
  const yearlyMonthly = monthly * 12;
  const savings = ((yearlyMonthly - annual) / yearlyMonthly) * 100;
  return Math.round(savings);
}

// Check if usage is near limit
export function isNearLimit(metric: UsageMetric, threshold = 0.8): boolean {
  if (metric.limit === null) return false;
  return metric.used / metric.limit >= threshold;
}

// Check if at limit
export function isAtLimit(metric: UsageMetric): boolean {
  if (metric.limit === null) return false;
  return metric.used >= metric.limit;
}

// Format usage display
export function formatUsage(metric: UsageMetric): string {
  if (metric.limit === null) {
    return `${metric.used} used (Unlimited)`;
  }
  return `${metric.used} of ${metric.limit} used`;
}

// Get usage percentage
export function getUsagePercentage(metric: UsageMetric): number {
  if (metric.limit === null) return 0;
  return Math.min((metric.used / metric.limit) * 100, 100);
}
