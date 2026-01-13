'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { useMemo } from 'react';

// Initialize Stripe outside of component to avoid recreating on re-render
let stripePromise: Promise<Stripe | null> | null = null;

function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      console.warn('Stripe publishable key not configured');
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
}

interface StripeProviderProps {
  children: React.ReactNode;
}

export function StripeProvider({ children }: StripeProviderProps) {
  const stripePromise = useMemo(() => getStripe(), []);

  const options = useMemo(
    () => ({
      appearance: {
        theme: 'stripe' as const,
        variables: {
          colorPrimary: '#00B391', // agile-teal
          colorBackground: '#ffffff',
          colorText: '#222222', // charcoal
          colorDanger: '#df1b41',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          spacingUnit: '4px',
          borderRadius: '8px',
        },
      },
    }),
    []
  );

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
