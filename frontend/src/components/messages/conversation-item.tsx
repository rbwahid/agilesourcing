'use client';

import Image from 'next/image';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InquiryStatusBadge } from './inquiry-status-badge';
import type { Conversation } from '@/types/message';
import {
  formatRelativeTime,
  truncateMessage,
} from '@/types/message';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  currentUserId: number;
  onClick: () => void;
}

export function ConversationItem({
  conversation,
  isActive,
  currentUserId,
  onClick,
}: ConversationItemProps) {
  // Determine the other participant (not the current user)
  const isDesigner = currentUserId === conversation.designer_id;
  const otherParticipant = isDesigner
    ? conversation.supplier
    : conversation.designer;

  const hasUnread = conversation.unread_count > 0;
  const avatarUrl = otherParticipant.profile?.avatar_url;
  const displayName =
    otherParticipant.profile?.company_name ||
    otherParticipant.profile?.business_name ||
    otherParticipant.name;

  // Get initials for avatar fallback
  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative flex w-full items-start gap-3 border-l-3 px-4 py-3 text-left transition-all duration-200',
        isActive
          ? 'border-l-agile-teal bg-agile-teal/5'
          : 'border-l-transparent hover:bg-gray-50',
        hasUnread && !isActive && 'bg-blue-50/50'
      )}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className={cn(
            'relative h-12 w-12 overflow-hidden rounded-full ring-2 transition-all',
            isActive ? 'ring-agile-teal/30' : 'ring-gray-100'
          )}
        >
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

        {/* Online indicator (placeholder for future) */}
        {/* <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-400" /> */}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {/* Header row */}
        <div className="mb-1 flex items-center justify-between gap-2">
          <h4
            className={cn(
              'truncate text-sm',
              hasUnread ? 'font-semibold text-charcoal' : 'font-medium text-gray-700'
            )}
          >
            {displayName}
          </h4>
          <span className="flex-shrink-0 text-xs text-gray-400">
            {conversation.last_message_at
              ? formatRelativeTime(conversation.last_message_at)
              : formatRelativeTime(conversation.created_at)}
          </span>
        </div>

        {/* Company/Role subtitle */}
        {otherParticipant.role === 'supplier' && (
          <p className="mb-1 truncate text-xs text-gray-400">
            {isDesigner ? 'Supplier' : 'Designer'}
          </p>
        )}

        {/* Message preview */}
        <div className="flex items-center gap-2">
          <p
            className={cn(
              'flex-1 truncate text-sm',
              hasUnread ? 'font-medium text-gray-700' : 'text-gray-500'
            )}
          >
            {conversation.latest_message
              ? truncateMessage(conversation.latest_message.content, 45)
              : conversation.subject || 'No messages yet'}
          </p>

          {/* Unread badge */}
          {hasUnread && (
            <span className="flex h-5 min-w-5 flex-shrink-0 items-center justify-center rounded-full bg-agile-teal px-1.5 text-xs font-semibold text-white">
              {conversation.unread_count > 99 ? '99+' : conversation.unread_count}
            </span>
          )}
        </div>

        {/* Inquiry status */}
        {conversation.inquiry && (
          <div className="mt-1.5">
            <InquiryStatusBadge
              status={conversation.inquiry.status}
              size="sm"
              showIcon={false}
            />
          </div>
        )}
      </div>

      {/* Hover indicator line */}
      <div
        className={cn(
          'absolute bottom-0 left-0 top-0 w-0.5 bg-agile-teal transition-opacity',
          isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
        )}
      />
    </button>
  );
}
