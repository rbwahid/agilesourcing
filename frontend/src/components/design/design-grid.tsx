'use client';

import { DesignCard } from './design-card';
import { DesignEmptyState } from './design-empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import type { Design } from '@/types/design';

interface DesignGridProps {
  designs?: Design[];
  isLoading?: boolean;
  onDelete?: (id: number) => void;
}

function DesignCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200/80">
      <Skeleton className="aspect-[4/5] w-full" />
      <div className="p-4">
        <Skeleton className="h-5 w-3/4" />
        <div className="mt-2 flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

export function DesignGrid({ designs, isLoading, onDelete }: DesignGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <DesignCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!designs || designs.length === 0) {
    return <DesignEmptyState />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {designs.map((design) => (
        <DesignCard key={design.id} design={design} onDelete={onDelete} />
      ))}
    </div>
  );
}
