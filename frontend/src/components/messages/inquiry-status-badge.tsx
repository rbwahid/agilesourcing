'use client';

import { MessageSquare, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { InquiryStatus } from '@/types/message';
import { getInquiryStatusConfig } from '@/types/message';

interface InquiryStatusBadgeProps {
  status: InquiryStatus;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

const statusIcons: Record<InquiryStatus, React.ElementType> = {
  new: MessageSquare,
  in_progress: Clock,
  quoted: CheckCircle2,
  closed: XCircle,
};

export function InquiryStatusBadge({
  status,
  size = 'sm',
  showIcon = true,
  className,
}: InquiryStatusBadgeProps) {
  const config = getInquiryStatusConfig(status);
  const Icon = statusIcons[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium',
        config.bgClass,
        config.textClass,
        config.borderClass,
        size === 'sm' && 'px-2 py-0.5 text-xs',
        size === 'md' && 'px-2.5 py-1 text-sm',
        className
      )}
    >
      {showIcon && (
        <Icon
          className={cn(
            size === 'sm' && 'h-3 w-3',
            size === 'md' && 'h-3.5 w-3.5'
          )}
        />
      )}
      {config.label}
    </span>
  );
}
