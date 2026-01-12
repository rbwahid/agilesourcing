import { cn } from '@/lib/utils';
import type { DesignStatus } from '@/types/design';

interface DesignStatusBadgeProps {
  status: DesignStatus;
  size?: 'sm' | 'md';
  className?: string;
}

const statusConfig: Record<
  DesignStatus,
  { label: string; className: string }
> = {
  draft: {
    label: 'Draft',
    className: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  },
  active: {
    label: 'Active',
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  },
  archived: {
    label: 'Archived',
    className: 'bg-gray-50 text-gray-600 ring-gray-500/20',
  },
};

export function DesignStatusBadge({
  status,
  size = 'md',
  className,
}: DesignStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium ring-1 ring-inset',
        size === 'sm' && 'px-2 py-0.5 text-xs',
        size === 'md' && 'px-2.5 py-1 text-xs',
        config.className,
        className
      )}
    >
      <span
        className={cn(
          'mr-1.5 h-1.5 w-1.5 rounded-full',
          status === 'draft' && 'bg-amber-500',
          status === 'active' && 'bg-emerald-500',
          status === 'archived' && 'bg-gray-400'
        )}
      />
      {config.label}
    </span>
  );
}
