'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FolderOpen, Search, Inbox, FileQuestion, type LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon = FolderOpen,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-charcoal/10 bg-light-grey/50 px-6 py-16 text-center',
        className
      )}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-agile-teal/10">
        <Icon className="h-8 w-8 text-agile-teal" />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-charcoal">{title}</h3>

      {description && (
        <p className="mb-6 max-w-sm text-sm text-charcoal-light">{description}</p>
      )}

      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {action && (
            <Button onClick={action.onClick} className="bg-agile-teal hover:bg-agile-teal/90">
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Pre-configured empty states for common use cases

export function NoResultsState({
  query,
  onClear,
}: {
  query?: string;
  onClear?: () => void;
}) {
  return (
    <EmptyState
      icon={Search}
      title="No results found"
      description={
        query
          ? `We couldn't find anything matching "${query}". Try adjusting your search or filters.`
          : 'Try adjusting your search or filters to find what you\'re looking for.'
      }
      action={onClear ? { label: 'Clear search', onClick: onClear } : undefined}
    />
  );
}

export function NoDataState({
  itemName = 'items',
  onCreate,
}: {
  itemName?: string;
  onCreate?: () => void;
}) {
  return (
    <EmptyState
      icon={Inbox}
      title={`No ${itemName} yet`}
      description={`Get started by creating your first ${itemName.replace(/s$/, '')}.`}
      action={onCreate ? { label: `Create ${itemName.replace(/s$/, '')}`, onClick: onCreate } : undefined}
    />
  );
}

export function NotFoundState({ onGoBack }: { onGoBack?: () => void }) {
  return (
    <EmptyState
      icon={FileQuestion}
      title="Page not found"
      description="The page you're looking for doesn't exist or has been moved."
      action={onGoBack ? { label: 'Go back', onClick: onGoBack } : undefined}
    />
  );
}
