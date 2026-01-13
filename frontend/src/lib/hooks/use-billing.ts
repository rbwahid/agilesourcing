import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getPlans,
  getPlan,
  getCurrentSubscription,
  createSubscription,
  changePlan,
  cancelSubscription,
  resumeSubscription,
  getSubscriptionUsage,
  getPaymentMethods,
  createSetupIntent,
  addPaymentMethod,
  setDefaultPaymentMethod,
  removePaymentMethod,
  getInvoices,
  getUpcomingInvoice,
  downloadInvoice,
} from '@/lib/api/billing';
import type {
  Plan,
  Subscription,
  CreateSubscriptionData,
  AddPaymentMethodData,
} from '@/types/billing';

// Query keys
export const billingKeys = {
  all: ['billing'] as const,
  plans: () => [...billingKeys.all, 'plans'] as const,
  plansByType: (userType: string) => [...billingKeys.plans(), userType] as const,
  plan: (slug: string) => [...billingKeys.all, 'plan', slug] as const,
  subscription: () => [...billingKeys.all, 'subscription'] as const,
  usage: () => [...billingKeys.all, 'usage'] as const,
  paymentMethods: () => [...billingKeys.all, 'payment-methods'] as const,
  invoices: () => [...billingKeys.all, 'invoices'] as const,
  upcomingInvoice: () => [...billingKeys.all, 'upcoming-invoice'] as const,
};

// Plans queries
export function usePlans(userType?: 'designer' | 'supplier') {
  return useQuery({
    queryKey: userType ? billingKeys.plansByType(userType) : billingKeys.plans(),
    queryFn: () => getPlans(userType),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function usePlan(slug: string) {
  return useQuery({
    queryKey: billingKeys.plan(slug),
    queryFn: () => getPlan(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

// Subscription queries
export function useSubscription() {
  return useQuery({
    queryKey: billingKeys.subscription(),
    queryFn: getCurrentSubscription,
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useSubscriptionUsage() {
  return useQuery({
    queryKey: billingKeys.usage(),
    queryFn: getSubscriptionUsage,
    staleTime: 60 * 1000, // 1 minute
  });
}

// Subscription mutations
export function useCreateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubscriptionData) => createSubscription(data),
    onSuccess: (subscription) => {
      queryClient.setQueryData(billingKeys.subscription(), subscription);
      queryClient.invalidateQueries({ queryKey: billingKeys.usage() });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('Subscription created successfully!');
    },
    onError: () => {
      toast.error('Failed to create subscription');
    },
  });
}

export function useChangePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubscriptionData) => changePlan(data),
    onSuccess: (subscription) => {
      queryClient.setQueryData(billingKeys.subscription(), subscription);
      queryClient.invalidateQueries({ queryKey: billingKeys.usage() });
      queryClient.invalidateQueries({ queryKey: billingKeys.upcomingInvoice() });
      toast.success('Plan changed successfully!');
    },
    onError: () => {
      toast.error('Failed to change plan');
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelSubscription,
    onSuccess: (subscription) => {
      queryClient.setQueryData(billingKeys.subscription(), subscription);
      toast.success('Subscription cancelled. You\'ll have access until the end of your billing period.');
    },
    onError: () => {
      toast.error('Failed to cancel subscription');
    },
  });
}

export function useResumeSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resumeSubscription,
    onSuccess: (subscription) => {
      queryClient.setQueryData(billingKeys.subscription(), subscription);
      toast.success('Subscription resumed successfully!');
    },
    onError: () => {
      toast.error('Failed to resume subscription');
    },
  });
}

// Payment methods queries
export function usePaymentMethods() {
  return useQuery({
    queryKey: billingKeys.paymentMethods(),
    queryFn: getPaymentMethods,
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useCreateSetupIntent() {
  return useMutation({
    mutationFn: createSetupIntent,
    onError: () => {
      toast.error('Failed to initialize payment form');
    },
  });
}

export function useAddPaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddPaymentMethodData) => addPaymentMethod(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.paymentMethods() });
      toast.success('Payment method added successfully!');
    },
    onError: () => {
      toast.error('Failed to add payment method');
    },
  });
}

export function useSetDefaultPaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentMethodId: string) => setDefaultPaymentMethod(paymentMethodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.paymentMethods() });
      toast.success('Default payment method updated');
    },
    onError: () => {
      toast.error('Failed to update default payment method');
    },
  });
}

export function useRemovePaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentMethodId: string) => removePaymentMethod(paymentMethodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.paymentMethods() });
      toast.success('Payment method removed');
    },
    onError: () => {
      toast.error('Failed to remove payment method');
    },
  });
}

// Invoices queries
export function useInvoices() {
  return useQuery({
    queryKey: billingKeys.invoices(),
    queryFn: getInvoices,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpcomingInvoice() {
  return useQuery({
    queryKey: billingKeys.upcomingInvoice(),
    queryFn: getUpcomingInvoice,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useDownloadInvoice() {
  return useMutation({
    mutationFn: async (invoiceId: string) => {
      const blob = await downloadInvoice(invoiceId);
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onError: () => {
      toast.error('Failed to download invoice');
    },
  });
}
