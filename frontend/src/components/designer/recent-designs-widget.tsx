'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Palette, ArrowRight, ImageOff } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDesigns } from '@/lib/hooks/use-designs';
import { cn } from '@/lib/utils';
import type { Design, DesignStatus } from '@/types/design';

const STATUS_STYLES: Record<DesignStatus, { bg: string; text: string; dot: string }> = {
  draft: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  active: { bg: 'bg-agile-teal/10', text: 'text-agile-teal', dot: 'bg-agile-teal' },
  archived: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
};

function formatRelativeTime(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface DesignItemProps {
  design: Design;
}

function DesignItem({ design }: DesignItemProps) {
  const status = STATUS_STYLES[design.status];

  return (
    <Link
      href={`/designs/${design.id}`}
      className="group flex items-center gap-4 rounded-lg p-2 transition-colors duration-200 hover:bg-gray-50"
    >
      {/* Thumbnail */}
      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
        {design.file_url ? (
          <Image
            src={design.file_url}
            alt={design.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="48px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageOff className="h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-charcoal transition-colors duration-200 group-hover:text-agile-teal">
          {design.title}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <Badge
            variant="secondary"
            className={cn('h-5 gap-1 px-2 text-[10px] font-medium uppercase tracking-wide', status.bg, status.text)}
          >
            <span className={cn('h-1.5 w-1.5 rounded-full', status.dot)} />
            {design.status}
          </Badge>
        </div>
      </div>

      {/* Time */}
      <span className="flex-shrink-0 text-xs text-gray-400">
        {formatRelativeTime(design.created_at)}
      </span>
    </Link>
  );
}

function DesignItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-2">
      <Skeleton className="h-12 w-12 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-3 w-12" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
        <Palette className="h-8 w-8 text-gray-400" />
      </div>
      <p className="font-medium text-charcoal">No designs yet</p>
      <p className="mt-1 text-sm text-gray-500">Start by creating your first design</p>
      <Button asChild className="mt-4 bg-agile-teal hover:bg-agile-teal/90">
        <Link href="/designs/new">Create Design</Link>
      </Button>
    </div>
  );
}

export function RecentDesignsWidget() {
  const { data, isLoading } = useDesigns({ per_page: 5 });
  const designs = data?.data ?? [];

  return (
    <Card className="border-gray-100 bg-white">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-agile-teal/10">
            <Palette className="h-4 w-4 text-agile-teal" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-charcoal">Recent Designs</h3>
        </div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="gap-1.5 text-sm text-gray-500 hover:text-agile-teal"
        >
          <Link href="/designs">
            View All
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="p-3">
        {isLoading ? (
          <div className="space-y-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <DesignItemSkeleton key={i} />
            ))}
          </div>
        ) : designs.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-1">
            {designs.map((design) => (
              <DesignItem key={design.id} design={design} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
