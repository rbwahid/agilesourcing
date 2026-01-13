'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  User,
  MoreVertical,
  ExternalLink,
  Archive,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { InquiryStatusBadge } from './inquiry-status-badge';
import type { Conversation } from '@/types/message';

interface ConversationHeaderProps {
  conversation: Conversation;
  currentUserId: number;
  onBack?: () => void;
  onArchive?: () => void;
  showBackButton?: boolean;
  className?: string;
}

export function ConversationHeader({
  conversation,
  currentUserId,
  onBack,
  onArchive,
  showBackButton = false,
  className,
}: ConversationHeaderProps) {
  // Determine the other participant
  const isDesigner = currentUserId === conversation.designer_id;
  const otherParticipant = isDesigner
    ? conversation.supplier
    : conversation.designer;

  const avatarUrl = otherParticipant.profile?.avatar_url;
  const displayName =
    otherParticipant.profile?.company_name ||
    otherParticipant.profile?.business_name ||
    otherParticipant.name;

  const profileUrl = isDesigner
    ? `/suppliers/${conversation.supplier_id}`
    : undefined;

  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div
      className={cn(
        'flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-3',
        className
      )}
    >
      {/* Back button (mobile) */}
      {showBackButton && (
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 flex-shrink-0 lg:hidden"
          onClick={onBack}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}

      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-gray-100">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              {initials ? (
                <span className="text-sm font-medium text-gray-600">
                  {initials}
                </span>
              ) : (
                <User className="h-5 w-5 text-gray-400" />
              )}
            </div>
          )}
        </div>
        {/* Online indicator placeholder */}
        {/* <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-400" /> */}
      </div>

      {/* Name and info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-medium text-charcoal">{displayName}</h3>
          {conversation.inquiry && (
            <InquiryStatusBadge
              status={conversation.inquiry.status}
              size="sm"
              showIcon={false}
            />
          )}
        </div>
        <p className="truncate text-xs text-gray-400">
          {isDesigner ? 'Supplier' : 'Designer'}
          {conversation.subject && (
            <>
              <span className="mx-1.5">·</span>
              <span className="text-gray-500">{conversation.subject}</span>
            </>
          )}
        </p>
      </div>

      {/* Actions dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0">
            <MoreVertical className="h-4 w-4 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {profileUrl && (
            <>
              <DropdownMenuItem asChild>
                <Link href={profileUrl} className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {conversation.status === 'active' && onArchive && (
            <DropdownMenuItem
              onClick={onArchive}
              className="flex items-center gap-2 text-gray-600"
            >
              <Archive className="h-4 w-4" />
              Archive Conversation
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
