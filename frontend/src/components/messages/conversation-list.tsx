'use client';

import { useState } from 'react';
import { Search, Plus, Archive, Inbox } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ConversationItem } from './conversation-item';
import { MessagesEmptyState } from './messages-empty-state';
import type { Conversation, ConversationStatus } from '@/types/message';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId?: number;
  currentUserId: number;
  isLoading?: boolean;
  onSelectConversation: (id: number) => void;
  onNewConversation: () => void;
  className?: string;
}

type FilterTab = 'active' | 'archived';

export function ConversationList({
  conversations,
  activeConversationId,
  currentUserId,
  isLoading = false,
  onSelectConversation,
  onNewConversation,
  className,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('active');

  // Filter conversations by tab
  const tabFilteredConversations = conversations.filter((c) =>
    activeTab === 'active'
      ? c.status === 'active'
      : c.status === 'archived'
  );

  // Filter by search query
  const filteredConversations = tabFilteredConversations.filter((conversation) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const isDesigner = currentUserId === conversation.designer_id;
    const otherParticipant = isDesigner
      ? conversation.supplier
      : conversation.designer;

    const searchableFields = [
      otherParticipant.name,
      otherParticipant.profile?.business_name,
      otherParticipant.profile?.company_name,
      conversation.subject,
      conversation.latest_message?.content,
    ].filter(Boolean);

    return searchableFields.some((field) =>
      field?.toLowerCase().includes(query)
    );
  });

  return (
    <div
      className={cn(
        'flex h-full flex-col border-r border-gray-100 bg-white',
        className
      )}
    >
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-100 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold text-charcoal">
            Messages
          </h2>
          <Button
            size="sm"
            onClick={onNewConversation}
            className="gap-1.5 bg-agile-teal text-xs hover:bg-agile-teal/90"
          >
            <Plus className="h-3.5 w-3.5" />
            New
          </Button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 bg-gray-50 pl-9 text-sm focus:bg-white"
          />
        </div>

        {/* Tab filters */}
        <div className="mt-3 flex gap-1 rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab('active')}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
              activeTab === 'active'
                ? 'bg-white text-charcoal shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <Inbox className="h-3.5 w-3.5" />
            Inbox
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
              activeTab === 'archived'
                ? 'bg-white text-charcoal shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <Archive className="h-3.5 w-3.5" />
            Archived
          </button>
        </div>
      </div>

      {/* Conversation list */}
      <ScrollArea className="flex-1">
        {isLoading ? (
          <ConversationListSkeleton />
        ) : filteredConversations.length === 0 ? (
          <div className="p-4">
            {searchQuery ? (
              <p className="text-center text-sm text-gray-500">
                No conversations match &quot;{searchQuery}&quot;
              </p>
            ) : (
              <MessagesEmptyState
                variant="no-conversations"
                onStartConversation={onNewConversation}
              />
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === activeConversationId}
                currentUserId={currentUserId}
                onClick={() => onSelectConversation(conversation.id)}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Results count */}
      {!isLoading && filteredConversations.length > 0 && (
        <div className="flex-shrink-0 border-t border-gray-100 px-4 py-2">
          <p className="text-center text-xs text-gray-400">
            {filteredConversations.length} conversation
            {filteredConversations.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}

function ConversationListSkeleton() {
  return (
    <div className="space-y-1 p-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-start gap-3 p-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-10" />
            </div>
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
