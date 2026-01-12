'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import {
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  FileText,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DesignStatusBadge } from './design-status-badge';
import type { Design } from '@/types/design';
import { cn } from '@/lib/utils';

interface DesignCardProps {
  design: Design;
  onDelete?: (id: number) => void;
}

export function DesignCard({ design, onDelete }: DesignCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isPdf = design.file_type === 'application/pdf';
  const timeAgo = formatDistanceToNow(new Date(design.created_at), {
    addSuffix: true,
  });

  return (
    <div
      className="group relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200/80 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 hover:ring-agile-teal/30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link href={`/designs/${design.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
          {isPdf ? (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <FileText className="h-16 w-16 text-gray-300" />
              <span className="mt-2 text-xs font-medium text-gray-400">
                PDF Document
              </span>
            </div>
          ) : (
            <Image
              src={design.file_url}
              alt={design.title}
              fill
              className={cn(
                'object-cover transition-transform duration-500',
                isHovered && 'scale-105'
              )}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          )}

          {/* Hover Overlay */}
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-0 transition-opacity duration-300',
              isHovered && 'opacity-100'
            )}
          />

          {/* View Button on Hover */}
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300',
              isHovered && 'opacity-100'
            )}
          >
            <span className="flex items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-sm font-medium text-charcoal shadow-lg backdrop-blur-sm transition-transform duration-300 hover:scale-105">
              <Eye className="h-4 w-4" />
              View Design
            </span>
          </div>

          {/* Status Badge */}
          <div className="absolute left-3 top-3">
            <DesignStatusBadge status={design.status} size="sm" />
          </div>

          {/* Variations Count */}
          {design.variations_count && design.variations_count > 0 && (
            <div className="absolute right-3 top-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-charcoal/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                <Layers className="h-3 w-3" />
                {design.variations_count}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Link
              href={`/designs/${design.id}`}
              className="block truncate font-semibold text-charcoal transition-colors hover:text-agile-teal"
            >
              {design.title}
            </Link>
            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
              <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-medium">
                {design.category_label}
              </span>
              <span className="text-gray-300">&middot;</span>
              <span>{timeAgo}</span>
            </div>
          </div>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-gray-400 hover:text-charcoal"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href={`/designs/${design.id}`} className="gap-2">
                  <Eye className="h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/designs/${design.id}/edit`} className="gap-2">
                  <Pencil className="h-4 w-4" />
                  Edit Design
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 text-red-600 focus:bg-red-50 focus:text-red-600"
                onClick={() => onDelete?.(design.id)}
              >
                <Trash2 className="h-4 w-4" />
                Delete Design
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
