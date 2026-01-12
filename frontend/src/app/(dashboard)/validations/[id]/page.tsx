'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ExternalLink,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Clock,
  TrendingUp,
  Loader2,
  XCircle,
  Instagram,
  Calendar,
  ImageOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ValidationStatusBadge, ValidationScoreDisplay } from '@/components/validation';
import { cn } from '@/lib/utils';
import { useValidation, useValidationPolling, useCancelValidation } from '@/lib/hooks/use-validations';
import { formatDistanceToNow, format } from 'date-fns';

interface ValidationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ValidationDetailPage({ params }: ValidationDetailPageProps) {
  const { id } = use(params);
  const validationId = parseInt(id);

  const { data: validation, isLoading, isError } = useValidation(validationId);
  const { mutate: cancelValidation, isPending: isCancelling } = useCancelValidation();

  // Poll for updates while validation is active
  useValidationPolling(validationId, { enabled: validation?.status === 'active' });

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Skeleton className="mb-8 h-8 w-48" />
          <div className="grid gap-8 lg:grid-cols-2">
            <Skeleton className="aspect-[4/5] rounded-2xl" />
            <div className="space-y-6">
              <Skeleton className="h-48 rounded-2xl" />
              <Skeleton className="h-32 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !validation) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500">Failed to load validation</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalEngagement =
    validation.likes_count +
    validation.comments_count +
    validation.shares_count +
    validation.saves_count;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/validations">
              <Button
                variant="ghost"
                size="sm"
                className="mb-4 gap-2 text-gray-500 hover:text-charcoal"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Validations
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-3xl font-bold tracking-tight text-charcoal">
                {validation.design?.title || 'Validation Details'}
              </h1>
              <ValidationStatusBadge status={validation.status} />
            </div>
            <p className="mt-1 text-gray-500">
              {validation.created_at &&
                `Started ${formatDistanceToNow(new Date(validation.created_at), { addSuffix: true })}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {validation.instagram_post_url && (
              <a
                href={validation.instagram_post_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="gap-2">
                  <Instagram className="h-4 w-4" />
                  View on Instagram
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </a>
            )}

            {validation.status === 'active' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="gap-2 text-red-600 hover:bg-red-50">
                    <XCircle className="h-4 w-4" />
                    Cancel
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Validation?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will stop tracking engagement metrics. The Instagram post will remain,
                      but you won&apos;t collect any more data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isCancelling}>Keep Running</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => cancelValidation(validationId)}
                      disabled={isCancelling}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isCancelling ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        'Cancel Validation'
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left column - Mockup preview */}
          <div className="space-y-6">
            <Card className="overflow-hidden border-0 shadow-lg shadow-gray-200/50">
              <div className="relative aspect-[4/5] bg-gray-100">
                {validation.mockup?.file_url ? (
                  <Image
                    src={validation.mockup.file_url}
                    alt="Validation mockup"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImageOff className="h-16 w-16 text-gray-300" />
                  </div>
                )}

                {/* Winner badge */}
                {validation.is_winner && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-1.5 text-sm font-semibold text-white shadow-lg">
                    Winner
                  </div>
                )}
              </div>
            </Card>

            {/* Caption */}
            {validation.caption && (
              <Card className="border-0 shadow-lg shadow-gray-200/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Caption</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm text-gray-600">{validation.caption}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right column - Metrics */}
          <div className="space-y-6">
            {/* Score */}
            <Card className="border-0 shadow-lg shadow-gray-200/50">
              <CardContent className="flex flex-col items-center p-8">
                <ValidationScoreDisplay
                  score={validation.validation_score}
                  size="lg"
                  animated={true}
                />
              </CardContent>
            </Card>

            {/* Engagement metrics */}
            <Card className="border-0 shadow-lg shadow-gray-200/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Engagement</CardTitle>
                  {validation.status === 'active' && (
                    <div className="flex items-center gap-1.5 text-xs text-agile-teal">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Live tracking
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center rounded-xl bg-red-50 p-4">
                    <Heart className="h-6 w-6 text-red-500" />
                    <span className="mt-2 text-2xl font-bold text-charcoal">
                      {formatNumber(validation.likes_count)}
                    </span>
                    <span className="text-xs text-gray-500">Likes</span>
                  </div>
                  <div className="flex flex-col items-center rounded-xl bg-blue-50 p-4">
                    <MessageCircle className="h-6 w-6 text-blue-500" />
                    <span className="mt-2 text-2xl font-bold text-charcoal">
                      {formatNumber(validation.comments_count)}
                    </span>
                    <span className="text-xs text-gray-500">Comments</span>
                  </div>
                  <div className="flex flex-col items-center rounded-xl bg-green-50 p-4">
                    <Share2 className="h-6 w-6 text-green-500" />
                    <span className="mt-2 text-2xl font-bold text-charcoal">
                      {formatNumber(validation.shares_count)}
                    </span>
                    <span className="text-xs text-gray-500">Shares</span>
                  </div>
                  <div className="flex flex-col items-center rounded-xl bg-purple-50 p-4">
                    <Bookmark className="h-6 w-6 text-purple-500" />
                    <span className="mt-2 text-2xl font-bold text-charcoal">
                      {formatNumber(validation.saves_count)}
                    </span>
                    <span className="text-xs text-gray-500">Saves</span>
                  </div>
                </div>

                {/* Total & Rate */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-gray-50 p-4 text-center">
                    <span className="text-sm text-gray-500">Total Engagement</span>
                    <p className="text-2xl font-bold text-charcoal">
                      {formatNumber(totalEngagement)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-agile-teal/10 p-4 text-center">
                    <span className="text-sm text-gray-500">Engagement Rate</span>
                    <p className="text-2xl font-bold text-agile-teal">
                      {validation.engagement_rate?.toFixed(2) || '0.00'}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline info */}
            <Card className="border-0 shadow-lg shadow-gray-200/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-agile-teal/10">
                    <Calendar className="h-5 w-5 text-agile-teal" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-charcoal">Started</p>
                    <p className="text-xs text-gray-500">
                      {validation.created_at
                        ? format(new Date(validation.created_at), 'MMM d, yyyy • h:mm a')
                        : 'Unknown'}
                    </p>
                  </div>
                </div>

                {validation.status === 'active' && validation.time_remaining && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                      <Clock className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-charcoal">Time Remaining</p>
                      <p className="text-xs text-gray-500">{validation.time_remaining}</p>
                    </div>
                  </div>
                )}

                {validation.status === 'completed' && validation.validation_ends_at && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                      <TrendingUp className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-charcoal">Completed</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(validation.validation_ends_at), 'MMM d, yyyy • h:mm a')}
                      </p>
                    </div>
                  </div>
                )}

                <div className="rounded-lg bg-gray-50 px-4 py-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Duration</span>
                    <span className="font-medium text-charcoal">
                      {validation.validation_duration_hours} hours
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
