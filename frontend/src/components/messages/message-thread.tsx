'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { MessageBubble } from './message-bubble';
import { MessagesEmptyState } from './messages-empty-state';
import type { Message } from '@/types/message';
import { formatDateSeparator } from '@/types/message';

interface MessageThreadProps {
  messages: Message[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  hasMorePages?: boolean;
  onLoadMore?: () => void;
  onDeleteMessage?: (messageId: number) => void;
  className?: string;
}

export function MessageThread({
  messages,
  isLoading = false,
  isLoadingMore = false,
  hasMorePages = false,
  onLoadMore,
  onDeleteMessage,
  className,
}: MessageThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);

  // Scroll to bottom when messages change and user is near bottom
  useEffect(() => {
    if (isNearBottom && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, isNearBottom]);

  // Initial scroll to bottom
  useEffect(() => {
    if (!isLoading && bottomRef.current) {
      bottomRef.current.scrollIntoView();
    }
  }, [isLoading]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    // Show button if scrolled up more than 200px
    setShowScrollButton(distanceFromBottom > 200);
    setIsNearBottom(distanceFromBottom < 100);

    // Load more when scrolled to top
    if (scrollTop < 100 && hasMorePages && !isLoadingMore && onLoadMore) {
      onLoadMore();
    }
  }, [hasMorePages, isLoadingMore, onLoadMore]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Group messages by date
  const groupedMessages = groupMessagesByDate(messages);

  if (isLoading) {
    return <MessageThreadSkeleton />;
  }

  if (messages.length === 0) {
    return (
      <div className={cn('flex-1', className)}>
        <MessagesEmptyState variant="no-messages" />
      </div>
    );
  }

  return (
    <div className={cn('relative flex-1', className)}>
      <ScrollArea
        ref={scrollRef}
        className="h-full"
        onScrollCapture={handleScroll}
      >
        <div className="flex flex-col px-4 py-4">
          {/* Load more indicator */}
          {isLoadingMore && (
            <div className="mb-4 flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          )}

          {hasMorePages && !isLoadingMore && (
            <div className="mb-4 flex items-center justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={onLoadMore}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Load earlier messages
              </Button>
            </div>
          )}

          {/* Messages grouped by date */}
          {groupedMessages.map((group) => (
            <div key={group.date}>
              {/* Date separator */}
              <div className="relative my-6 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100" />
                </div>
                <span className="relative bg-white px-3 text-xs font-medium text-gray-400">
                  {group.label}
                </span>
              </div>

              {/* Messages in this date group */}
              {group.messages.map((message, index) => {
                const prevMessage = index > 0 ? group.messages[index - 1] : null;
                const isConsecutive =
                  prevMessage?.sender_id === message.sender_id &&
                  isWithinMinutes(prevMessage.created_at, message.created_at, 5);

                return (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isConsecutive={isConsecutive}
                    onDelete={onDeleteMessage}
                  />
                );
              })}
            </div>
          ))}

          {/* Bottom anchor for auto-scroll */}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <Button
            size="sm"
            variant="secondary"
            className="gap-1.5 rounded-full bg-white px-4 shadow-lg hover:shadow-xl"
            onClick={scrollToBottom}
          >
            <ChevronDown className="h-4 w-4" />
            <span className="text-xs">New messages</span>
          </Button>
        </div>
      )}
    </div>
  );
}

function MessageThreadSkeleton() {
  return (
    <div className="flex flex-1 flex-col space-y-4 p-4">
      {/* Date separator skeleton */}
      <div className="flex justify-center">
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Message skeletons - alternating sides */}
      <div className="flex items-start gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-16 w-48 rounded-2xl rounded-bl-md" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>

      <div className="flex flex-row-reverse items-start gap-2">
        <div className="space-y-2">
          <Skeleton className="h-12 w-40 rounded-2xl rounded-br-md" />
          <div className="flex justify-end">
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </div>

      <div className="flex flex-row-reverse items-start gap-2">
        <div className="space-y-2">
          <Skeleton className="h-20 w-56 rounded-2xl rounded-br-md" />
          <div className="flex justify-end">
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-10 w-32 rounded-2xl rounded-bl-md" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

// Helper to group messages by date
interface MessageGroup {
  date: string;
  label: string;
  messages: Message[];
}

function groupMessagesByDate(messages: Message[]): MessageGroup[] {
  const groups: MessageGroup[] = [];
  let currentGroup: MessageGroup | null = null;

  for (const message of messages) {
    const date = new Date(message.created_at);
    const dateKey = date.toISOString().split('T')[0];
    const label = formatDateSeparator(message.created_at);

    if (!currentGroup || currentGroup.date !== dateKey) {
      currentGroup = {
        date: dateKey,
        label,
        messages: [],
      };
      groups.push(currentGroup);
    }

    currentGroup.messages.push(message);
  }

  return groups;
}

// Helper to check if two timestamps are within N minutes
function isWithinMinutes(
  timestamp1: string,
  timestamp2: string,
  minutes: number
): boolean {
  const date1 = new Date(timestamp1).getTime();
  const date2 = new Date(timestamp2).getTime();
  const diffMs = Math.abs(date2 - date1);
  return diffMs < minutes * 60 * 1000;
}
