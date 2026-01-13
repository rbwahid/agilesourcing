'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/hooks/use-auth';
import {
  useConversations,
  useMessages,
  useMessagesPolling,
  useSendMessage,
  useMarkAsRead,
  useArchiveConversation,
  useCreateConversation,
} from '@/lib/hooks/use-messages';
import {
  ConversationList,
  ConversationHeader,
  MessageThread,
  MessageInput,
  NewConversationDialog,
  MessagesEmptyState,
} from '@/components/messages';
import type { Message } from '@/types/message';

export default function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationParam = searchParams.get('conversation');
  const supplierParam = searchParams.get('supplier');

  const { user, isLoading: isAuthLoading } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(
    conversationParam ? parseInt(conversationParam, 10) : null
  );
  const [showNewDialog, setShowNewDialog] = useState(!!supplierParam);
  const [isMobileThreadView, setIsMobileThreadView] = useState(false);

  // Fetch conversations
  const { data: conversations = [], isLoading: isLoadingConversations } =
    useConversations('all');

  // Find selected conversation
  const selectedConversation = useMemo(
    () => conversations.find((c) => c.id === selectedConversationId),
    [conversations, selectedConversationId]
  );

  // Fetch messages for selected conversation
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessages(selectedConversationId || 0);

  // Enable polling for active conversation
  useMessagesPolling(selectedConversationId || 0, !!selectedConversationId);

  // Flatten messages from infinite query
  const messages = useMemo<Message[]>(() => {
    if (!messagesData?.pages) return [];
    return messagesData.pages.flatMap((page) => page.data);
  }, [messagesData]);

  // Mutations
  const sendMessageMutation = useSendMessage(selectedConversationId || 0);
  const markAsReadMutation = useMarkAsRead(selectedConversationId || 0);
  const archiveMutation = useArchiveConversation();
  const createConversationMutation = useCreateConversation();

  // Update URL when conversation changes
  useEffect(() => {
    if (selectedConversationId) {
      const params = new URLSearchParams();
      params.set('conversation', String(selectedConversationId));
      router.replace(`/messages?${params.toString()}`, { scroll: false });
    }
  }, [selectedConversationId, router]);

  // Mark as read when viewing conversation
  useEffect(() => {
    if (selectedConversationId && selectedConversation?.unread_count) {
      markAsReadMutation.mutate();
    }
  }, [selectedConversationId, selectedConversation?.unread_count]);

  // Handle conversation selection
  const handleSelectConversation = useCallback((id: number) => {
    setSelectedConversationId(id);
    setIsMobileThreadView(true);
  }, []);

  // Handle back button (mobile)
  const handleBack = useCallback(() => {
    setIsMobileThreadView(false);
    setSelectedConversationId(null);
    router.replace('/messages', { scroll: false });
  }, [router]);

  // Handle send message
  const handleSendMessage = useCallback(
    (content: string, attachments?: File[]) => {
      sendMessageMutation.mutate({ content, attachments });
    },
    [sendMessageMutation]
  );

  // Handle archive
  const handleArchive = useCallback(() => {
    if (selectedConversationId) {
      archiveMutation.mutate(selectedConversationId, {
        onSuccess: () => {
          setSelectedConversationId(null);
          setIsMobileThreadView(false);
        },
      });
    }
  }, [selectedConversationId, archiveMutation]);

  // Handle new conversation
  const handleNewConversation = useCallback(() => {
    setShowNewDialog(true);
  }, []);

  // Handle create conversation
  const handleCreateConversation = useCallback(
    (data: Parameters<typeof createConversationMutation.mutate>[0]) => {
      createConversationMutation.mutate(data, {
        onSuccess: (response) => {
          setShowNewDialog(false);
          setSelectedConversationId(response.data.id);
          setIsMobileThreadView(true);
        },
      });
    },
    [createConversationMutation]
  );

  // Handle load more messages
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Handle delete message
  const handleDeleteMessage = useCallback(
    (messageId: number) => {
      // Use the delete mutation from hooks
    },
    []
  );

  if (isAuthLoading || !user) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-agile-teal" />
      </div>
    );
  }

  return (
    <>
      <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">
        {/* Conversation List (Desktop: always visible, Mobile: visible when no thread selected) */}
        <div
          className={cn(
            'w-full flex-shrink-0 border-r border-gray-100 lg:w-80 xl:w-96',
            isMobileThreadView && 'hidden lg:block'
          )}
        >
          <ConversationList
            conversations={conversations}
            activeConversationId={selectedConversationId ?? undefined}
            currentUserId={user.id}
            isLoading={isLoadingConversations}
            onSelectConversation={handleSelectConversation}
            onNewConversation={handleNewConversation}
            className="h-full"
          />
        </div>

        {/* Message Thread Area */}
        <div
          className={cn(
            'flex flex-1 flex-col',
            !isMobileThreadView && !selectedConversationId && 'hidden lg:flex'
          )}
        >
          {selectedConversation ? (
            <>
              {/* Conversation Header */}
              <ConversationHeader
                conversation={selectedConversation}
                currentUserId={user.id}
                showBackButton={isMobileThreadView}
                onBack={handleBack}
                onArchive={handleArchive}
              />

              {/* Message Thread */}
              <MessageThread
                messages={messages}
                isLoading={isLoadingMessages}
                isLoadingMore={isFetchingNextPage}
                hasMorePages={hasNextPage}
                onLoadMore={handleLoadMore}
                onDeleteMessage={handleDeleteMessage}
                className="flex-1"
              />

              {/* Message Input */}
              <MessageInput
                onSend={handleSendMessage}
                isSending={sendMessageMutation.isPending}
                disabled={selectedConversation.status !== 'active'}
              />
            </>
          ) : (
            <MessagesEmptyState
              variant="no-selection"
              onStartConversation={handleNewConversation}
            />
          )}
        </div>
      </div>

      {/* New Conversation Dialog */}
      <NewConversationDialog
        open={showNewDialog}
        onOpenChange={setShowNewDialog}
        onSubmit={handleCreateConversation}
        isSubmitting={createConversationMutation.isPending}
        preselectedSupplierId={supplierParam ? parseInt(supplierParam, 10) : undefined}
      />
    </>
  );
}
