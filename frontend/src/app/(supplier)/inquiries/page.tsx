'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Inbox,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ImageIcon,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useInquiries, useUpdateInquiryStatus, useInquiryStats } from '@/lib/hooks/use-messages';
import { InquiryStatusBadge } from '@/components/messages';
import type { Inquiry, InquiryStatus } from '@/types/message';
import { formatRelativeTime, truncateMessage } from '@/types/message';

type FilterStatus = InquiryStatus | 'all';

const STATUS_TABS: { value: FilterStatus; label: string; icon: React.ElementType }[] = [
  { value: 'all', label: 'All', icon: Inbox },
  { value: 'new', label: 'New', icon: MessageSquare },
  { value: 'in_progress', label: 'In Progress', icon: Clock },
  { value: 'quoted', label: 'Quoted', icon: CheckCircle2 },
  { value: 'closed', label: 'Closed', icon: XCircle },
];

export default function InquiriesPage() {
  const [activeTab, setActiveTab] = useState<FilterStatus>('all');

  // Fetch inquiries
  const { data: inquiries = [], isLoading } = useInquiries(
    activeTab === 'all' ? undefined : activeTab
  );

  // Fetch stats
  const { data: stats } = useInquiryStats();

  // Get counts for tabs
  const tabCounts = useMemo(
    () => ({
      all: stats?.total ?? 0,
      new: stats?.new ?? 0,
      in_progress: stats?.in_progress ?? 0,
      quoted: stats?.quoted ?? 0,
      closed: stats?.closed ?? 0,
    }),
    [stats]
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal sm:text-3xl">
            Inquiries
          </h1>
          <p className="text-gray-600">
            Manage inquiries from fashion designers
          </p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 rounded-xl bg-gray-50 p-1.5">
        {STATUS_TABS.map((tab) => {
          const count = tabCounts[tab.value];
          const Icon = tab.icon;
          const isActive = activeTab === tab.value;

          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
                isActive
                  ? 'bg-white text-charcoal shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {count > 0 && (
                <span
                  className={cn(
                    'ml-1 rounded-full px-2 py-0.5 text-xs font-semibold',
                    isActive
                      ? 'bg-agile-teal/10 text-agile-teal'
                      : 'bg-gray-200 text-gray-600'
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Inquiry List */}
      {isLoading ? (
        <InquiriesLoadingSkeleton />
      ) : inquiries.length === 0 ? (
        <EmptyInquiriesState activeTab={activeTab} />
      ) : (
        <div className="grid gap-4">
          {inquiries.map((inquiry) => (
            <InquiryCard key={inquiry.id} inquiry={inquiry} />
          ))}
        </div>
      )}
    </div>
  );
}

interface InquiryCardProps {
  inquiry: Inquiry;
}

function InquiryCard({ inquiry }: InquiryCardProps) {
  const updateStatusMutation = useUpdateInquiryStatus();

  const handleStatusChange = (newStatus: InquiryStatus) => {
    updateStatusMutation.mutate({ id: inquiry.id, status: newStatus });
  };

  const designer = inquiry.designer;
  const avatarUrl = designer?.profile?.avatar_url;
  const designerName = designer?.profile?.business_name || designer?.name || 'Unknown';

  const initials = designerName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Card className="border-gray-100 transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
          {/* Design Preview */}
          {inquiry.design && (
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
              {inquiry.design.primary_image_url ? (
                <Image
                  src={inquiry.design.primary_image_url}
                  alt={inquiry.design.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-gray-300" />
                </div>
              )}
            </div>
          )}

          {/* Inquiry Info */}
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <InquiryStatusBadge status={inquiry.status} size="sm" />
              <span className="text-xs text-gray-400">
                {formatRelativeTime(inquiry.created_at)}
              </span>
            </div>

            {inquiry.design && (
              <h3 className="mb-1 truncate font-medium text-charcoal">
                {inquiry.design.title}
              </h3>
            )}

            {/* Designer info */}
            <div className="flex items-center gap-2">
              <div className="relative h-6 w-6 overflow-hidden rounded-full">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={designerName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-[10px] font-medium text-gray-600">
                    {initials}
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-600">{designerName}</span>
            </div>

            {/* Latest message preview */}
            {inquiry.conversation?.latest_message && (
              <p className="mt-2 truncate text-sm text-gray-500">
                {truncateMessage(inquiry.conversation.latest_message.content, 60)}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-shrink-0 items-center gap-2">
            {/* Status dropdown */}
            <Select
              value={inquiry.status}
              onValueChange={(value) => handleStatusChange(value as InquiryStatus)}
              disabled={updateStatusMutation.isPending}
            >
              <SelectTrigger className="h-9 w-32 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="quoted">Quoted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            {/* View conversation button */}
            <Button asChild variant="outline" size="sm" className="gap-1">
              <Link href={`/messages?conversation=${inquiry.conversation_id}`}>
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">View</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Unread indicator */}
        {(inquiry.conversation?.unread_count ?? 0) > 0 && (
          <div className="border-t border-gray-50 bg-blue-50/50 px-4 py-2">
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1.5 text-xs font-semibold text-white">
                {inquiry.conversation!.unread_count}
              </span>
              <span>new message{inquiry.conversation!.unread_count !== 1 && 's'}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function InquiriesLoadingSkeleton() {
  return (
    <div className="grid gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="border-gray-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-lg" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-9 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

interface EmptyInquiriesStateProps {
  activeTab: FilterStatus;
}

function EmptyInquiriesState({ activeTab }: EmptyInquiriesStateProps) {
  const messages = {
    all: {
      title: 'No inquiries yet',
      description:
        'Once designers discover your profile and send messages, their inquiries will appear here.',
    },
    new: {
      title: 'No new inquiries',
      description: 'All new inquiries have been reviewed.',
    },
    in_progress: {
      title: 'No inquiries in progress',
      description: 'Move inquiries here when you start working on them.',
    },
    quoted: {
      title: 'No quoted inquiries',
      description: 'Inquiries you have sent quotes for will appear here.',
    },
    closed: {
      title: 'No closed inquiries',
      description: 'Completed or declined inquiries will appear here.',
    },
  };

  const { title, description } = messages[activeTab];

  return (
    <Card className="border-gray-100">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
          <Inbox className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="mt-4 font-serif text-lg font-semibold text-charcoal">
          {title}
        </h3>
        <p className="mt-2 max-w-sm text-sm text-gray-500">{description}</p>
        {activeTab === 'all' && (
          <Button asChild variant="outline" className="mt-6 gap-2">
            <Link href="/supplier-profile">
              Complete Your Profile
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
