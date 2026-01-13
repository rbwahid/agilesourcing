'use client';

import { cn } from '@/lib/utils';
import type { BillingPeriod } from '@/types/billing';

interface PricingToggleProps {
  value: BillingPeriod;
  onChange: (value: BillingPeriod) => void;
  savingsPercentage?: number;
}

export function PricingToggle({
  value,
  onChange,
  savingsPercentage = 17,
}: PricingToggleProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <span
        className={cn(
          'text-sm font-medium transition-colors',
          value === 'monthly' ? 'text-charcoal' : 'text-gray-400'
        )}
      >
        Monthly
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={value === 'annual'}
        onClick={() => onChange(value === 'monthly' ? 'annual' : 'monthly')}
        className={cn(
          'relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent',
          'transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-agile-teal focus:ring-offset-2',
          value === 'annual' ? 'bg-agile-teal' : 'bg-gray-200'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0',
            'transition duration-200 ease-in-out',
            value === 'annual' ? 'translate-x-7' : 'translate-x-0'
          )}
        />
      </button>

      <div className="flex items-center gap-2">
        <span
          className={cn(
            'text-sm font-medium transition-colors',
            value === 'annual' ? 'text-charcoal' : 'text-gray-400'
          )}
        >
          Yearly
        </span>
        {savingsPercentage > 0 && (
          <span className="rounded-full bg-gradient-to-r from-agile-teal to-mint-accent px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
            Save {savingsPercentage}%
          </span>
        )}
      </div>
    </div>
  );
}
