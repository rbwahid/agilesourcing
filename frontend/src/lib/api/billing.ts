import { apiClient } from './client';
import type {
  Plan,
  Subscription,
  PaymentMethod,
  Invoice,
  UpcomingInvoice,
  SubscriptionUsage,
  CreateSubscriptionData,
  AddPaymentMethodData,
  SetupIntentResponse,
} from '@/types/billing';

// Plans
export async function getPlans(userType?: 'designer' | 'supplier'): Promise<Plan[]> {
  const params = userType ? { user_type: userType } : {};
  const response = await apiClient.get('/v1/plans', { params });
  return response.data.data;
}

export async function getPlan(slug: string): Promise<Plan> {
  const response = await apiClient.get(`/v1/plans/${slug}`);
  return response.data.data;
}

// Subscription
export async function getCurrentSubscription(): Promise<Subscription | null> {
  const response = await apiClient.get('/v1/subscription');
  return response.data.data;
}

export async function createSubscription(data: CreateSubscriptionData): Promise<Subscription> {
  const response = await apiClient.post('/v1/subscription', data);
  return response.data.data;
}

export async function changePlan(data: CreateSubscriptionData): Promise<Subscription> {
  const response = await apiClient.put('/v1/subscription', data);
  return response.data.data;
}

export async function cancelSubscription(): Promise<Subscription> {
  const response = await apiClient.post('/v1/subscription/cancel');
  return response.data.data;
}

export async function resumeSubscription(): Promise<Subscription> {
  const response = await apiClient.post('/v1/subscription/resume');
  return response.data.data;
}

export async function getSubscriptionUsage(): Promise<SubscriptionUsage> {
  const response = await apiClient.get('/v1/subscription/usage');
  return response.data.data;
}

// Payment Methods
export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const response = await apiClient.get('/v1/payment-methods');
  return response.data.data;
}

export async function createSetupIntent(): Promise<SetupIntentResponse> {
  const response = await apiClient.post('/v1/payment-methods/setup-intent');
  return response.data.data;
}

export async function addPaymentMethod(data: AddPaymentMethodData): Promise<PaymentMethod> {
  const response = await apiClient.post('/v1/payment-methods', data);
  return response.data.data;
}

export async function setDefaultPaymentMethod(paymentMethodId: string): Promise<void> {
  await apiClient.put('/v1/payment-methods/default', {
    payment_method_id: paymentMethodId,
  });
}

export async function removePaymentMethod(paymentMethodId: string): Promise<void> {
  await apiClient.delete(`/v1/payment-methods/${paymentMethodId}`);
}

// Billing & Invoices
export async function getInvoices(): Promise<Invoice[]> {
  const response = await apiClient.get('/v1/billing/invoices');
  return response.data.data;
}

export async function getUpcomingInvoice(): Promise<UpcomingInvoice | null> {
  const response = await apiClient.get('/v1/billing/upcoming');
  return response.data.data;
}

export async function downloadInvoice(invoiceId: string): Promise<Blob> {
  const response = await apiClient.get(`/v1/billing/invoices/${invoiceId}/download`, {
    responseType: 'blob',
  });
  return response.data;
}
