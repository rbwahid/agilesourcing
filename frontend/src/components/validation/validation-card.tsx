'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle, Share2, Bookmark, Clock, ArrowRight, ImageOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ValidationStatusBadge } from './validation-status-badge';
import { cn } from '@/lib/utils';
import type { Validation } from '@/types/validation';
import { formatDistanceToNow } from 'date-fns';

interface ValidationCardProps {
  validation: Validation;
  className?: string;
}

export function ValidationCard({ validation, className }: ValidationCardProps) {
  const totalEngagement =
    validation.likes_count +
    validation.comments_count +
    validation.shares_count +
    validation.saves_count;

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <Link href={`/validations/${validation.id}`}>
      <Card
        className={cn(
          'group overflow-hidden border-0 shadow-md shadow-gray-200/50 transition-all duration-300',
          'hover:shadow-xl hover:shadow-gray-300/50 hover:-translate-y-1',
          className
        )}
      >
        {/* Mockup Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
          {validation.mockup?.file_url ? (
            <Image
              src={validation.mockup.file_url}
              alt={validation.design?.title || 'Validation mockup'}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400">
              <ImageOff className="h-12 w-12 mb-2" />
              <span className="text-sm">No Preview</span>
            </div>
          )}

          {/* Status badge overlay */}
          <div className="absolute left-3 top-3">
            <ValidationStatusBadge status={validation.status} />
          </div>

          {/* Score overlay for completed validations */}
          {validation.status === 'completed' && validation.validation_score !== null && (
            <div className="absolute right-3 top-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 shadow-lg backdrop-blur-sm">
              <span
                className={cn(
                  'text-lg font-bold',
                  validation.validation_score >= 60 ? 'text-emerald-600' : 'text-amber-600'
                )}
              >
                {validation.validation_score}
              </span>
            </div>
          )}

          {/* Winner badge */}
          {validation.is_winner && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
              Winner
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-charcoal/60 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 font-medium text-charcoal shadow-lg">
              View Details
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-charcoal truncate">
            {validation.design?.title || 'Untitled Design'}
          </h3>

          {/* Time info */}
          <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            {validation.status === 'active' && validation.time_remaining
              ? `Ends ${validation.time_remaining}`
              : validation.created_at
              ? formatDistanceToNow(new Date(validation.created_at), { addSuffix: true })
              : 'Unknown'}
          </p>

          {/* Engagement metrics */}
          <div className="mt-3 grid grid-cols-4 gap-2">
            <div className="flex flex-col items-center rounded-lg bg-gray-50 p-2">
              <Heart
                className={cn(
                  'h-4 w-4',
                  validation.likes_count > 0 ? 'text-red-500' : 'text-gray-400'
                )}
              />
              <span className="mt-1 text-xs font-medium text-charcoal">
                {formatNumber(validation.likes_count)}
              </span>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-gray-50 p-2">
              <MessageCircle
                className={cn(
                  'h-4 w-4',
                  validation.comments_count > 0 ? 'text-blue-500' : 'text-gray-400'
                )}
              />
              <span className="mt-1 text-xs font-medium text-charcoal">
                {formatNumber(validation.comments_count)}
              </span>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-gray-50 p-2">
              <Share2
                className={cn(
                  'h-4 w-4',
                  validation.shares_count > 0 ? 'text-green-500' : 'text-gray-400'
                )}
              />
              <span className="mt-1 text-xs font-medium text-charcoal">
                {formatNumber(validation.shares_count)}
              </span>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-gray-50 p-2">
              <Bookmark
                className={cn(
                  'h-4 w-4',
                  validation.saves_count > 0 ? 'text-purple-500' : 'text-gray-400'
                )}
              />
              <span className="mt-1 text-xs font-medium text-charcoal">
                {formatNumber(validation.saves_count)}
              </span>
            </div>
          </div>

          {/* Engagement rate */}
          {validation.engagement_rate !== null && (
            <div className="mt-3 flex items-center justify-between rounded-lg bg-agile-teal/5 px-3 py-2">
              <span className="text-xs text-gray-600">Engagement Rate</span>
              <span className="text-sm font-semibold text-agile-teal">
                {validation.engagement_rate.toFixed(2)}%
              </span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
