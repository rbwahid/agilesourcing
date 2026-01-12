'use client';

import { cn } from '@/lib/utils';
import type { ValidationStatus } from '@/types/validation';
import { Clock, CheckCircle, XCircle, AlertCircle, Ban } from 'lucide-react';

interface ValidationStatusBadgeProps {
  status: ValidationStatus;
  className?: string;
  showIcon?: boolean;
}

const statusConfig: Record<
  ValidationStatus,
  { label: string; className: string; icon: typeof Clock }
> = {
  pending: {
    label: 'Pending',
    className: 'bg-amber-50 text-amber-700 ring-amber-200',
    icon: Clock,
  },
  active: {
    label: 'Active',
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    icon: CheckCircle,
  },
  completed: {
    label: 'Completed',
    className: 'bg-blue-50 text-blue-700 ring-blue-200',
    icon: CheckCircle,
  },
  failed: {
    label: 'Failed',
    className: 'bg-red-50 text-red-700 ring-red-200',
    icon: XCircle,
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-gray-100 text-gray-600 ring-gray-200',
    icon: Ban,
  },
};

export function ValidationStatusBadge({
  status,
  className,
  showIcon = true,
}: ValidationStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        config.className,
        className
      )}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </span>
  );
}
