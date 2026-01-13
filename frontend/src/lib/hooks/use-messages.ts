'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  getConversations,
  getConversation,
  createConversation,
  archiveConversation,
  getUnreadCount,
  getMessages,
  sendMessage,
  markAsRead,
  deleteMessage,
  getInquiries,
  updateInquiryStatus,
  getInquiryStats,
} from '@/lib/api/messages';
import type {
  ConversationStatus,
  InquiryStatus,
  CreateConversationData,
  Message,
} from '@/types/message';

/*
|--------------------------------------------------------------------------
| Query Keys
|--------------------------------------------------------------------------
*/

export const messageKeys = {
  all: ['messages'] as const,
  conversations: () => [...messageKeys.all, 'conversations'] as const,
  conversationList: (status?: ConversationStatus | 'all') =>
    [...messageKeys.conversations(), { status }] as const,
  conversationDetail: (id: number) =>
    [...messageKeys.conversations(), 'detail', id] as const,
  unreadCount: () => [...messageKeys.all, 'unreadCount'] as const,
  messageList: (conversationId: number) =>
    [...messageKeys.all, 'list', conversationId] as const,
  inquiries: () => [...messageKeys.all, 'inquiries'] as const,
  inquiryList: (status?: InquiryStatus) =>
    [...messageKeys.inquiries(), { status }] as const,
  inquiryStats: () => [...messageKeys.inquiries(), 'stats'] as const,
};

/*
|--------------------------------------------------------------------------
| Conversation Hooks
|--------------------------------------------------------------------------
*/

/**
 * Hook to fetch conversations
 */
export function useConversations(status?: ConversationStatus | 'all') {
  return useQuery({
    queryKey: messageKeys.conversationList(status),
    queryFn: () => getConversations(status),
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Hook to fetch a single conversation
 */
export function useConversation(id: number) {
  return useQuery({
    queryKey: messageKeys.conversationDetail(id),
    queryFn: () => getConversation(id),
    enabled: !!id,
    staleTime: 1000 * 30,
  });
}

/**
 * Hook to create a new conversation
 */
export function useCreateConversation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateConversationData) => createConversation(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });
      toast.success('Message sent');
      router.push(`/messages?conversation=${response.data.id}`);
    },
    onError: () => {
      toast.error('Failed to send message');
    },
  });
}

/**
 * Hook to archive a conversation
 */
export function useArchiveConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => archiveConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });
      toast.success('Conversation archived');
    },
    onError: () => {
      toast.error('Failed to archive conversation');
    },
  });
}

/**
 * Hook to fetch unread count - polls every 60 seconds
 */
export function useUnreadCount(enabled: boolean = true) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return useQuery({
    queryKey: messageKeys.unreadCount(),
    queryFn: getUnreadCount,
    enabled: enabled && isVisible,
    refetchInterval: isVisible ? 60000 : false, // Poll every 60 seconds when visible
    staleTime: 1000 * 30,
  });
}

/*
|--------------------------------------------------------------------------
| Message Hooks
|--------------------------------------------------------------------------
*/

/**
 * Hook to fetch messages with infinite scroll
 */
export function useMessages(conversationId: number) {
  return useInfiniteQuery({
    queryKey: messageKeys.messageList(conversationId),
    queryFn: ({ pageParam = 1 }) => getMessages(conversationId, pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.has_more_pages) {
        return lastPage.meta.current_page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!conversationId,
    staleTime: 1000 * 10, // 10 seconds
  });
}

/**
 * Hook for polling messages in active conversation - polls every 10 seconds
 */
export function useMessagesPolling(conversationId: number, enabled: boolean = true) {
  const [isVisible, setIsVisible] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return useQuery({
    queryKey: [...messageKeys.messageList(conversationId), 'polling'] as const,
    queryFn: async () => {
      const response = await getMessages(conversationId, 1);
      // Update the infinite query cache with new messages
      queryClient.setQueryData(
        messageKeys.messageList(conversationId),
        (oldData: { pages: { data: Message[] }[]; pageParams: number[] } | undefined) => {
          if (!oldData) return undefined;
          // Update first page with latest messages
          return {
            ...oldData,
            pages: [
              { ...oldData.pages[0], data: response.data },
              ...oldData.pages.slice(1),
            ],
          };
        }
      );
      return response;
    },
    enabled: enabled && isVisible && !!conversationId,
    refetchInterval: isVisible ? 10000 : false, // Poll every 10 seconds when visible
    staleTime: 1000 * 5,
  });
}

/**
 * Hook to send a message with optimistic update
 */
export function useSendMessage(conversationId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      content,
      attachments,
    }: {
      content: string;
      attachments?: File[];
    }) => sendMessage(conversationId, content, attachments),
    onMutate: async ({ content }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: messageKeys.messageList(conversationId),
      });

      // Get current data for rollback
      const previousData = queryClient.getQueryData(
        messageKeys.messageList(conversationId)
      );

      // Optimistically add the message (temporary ID)
      const tempMessage: Message = {
        id: Date.now(), // Temporary ID
        conversation_id: conversationId,
        sender_id: 0, // Will be replaced
        content,
        attachments: null,
        read_at: null,
        created_at: new Date().toISOString(),
        sender: {
          id: 0,
          name: 'You',
          email: '',
          role: 'designer',
          profile: null,
        },
        is_own: true,
      };

      queryClient.setQueryData(
        messageKeys.messageList(conversationId),
        (oldData: { pages: { data: Message[] }[]; pageParams: number[] } | undefined) => {
          if (!oldData) return undefined;
          return {
            ...oldData,
            pages: [
              {
                ...oldData.pages[0],
                data: [...oldData.pages[0].data, tempMessage],
              },
              ...oldData.pages.slice(1),
            ],
          };
        }
      );

      return { previousData };
    },
    onError: (_, __, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(
          messageKeys.messageList(conversationId),
          context.previousData
        );
      }
      toast.error('Failed to send message');
    },
    onSuccess: () => {
      // Refetch to get the actual message from server
      queryClient.invalidateQueries({
        queryKey: messageKeys.messageList(conversationId),
      });
      queryClient.invalidateQueries({
        queryKey: messageKeys.conversations(),
      });
    },
  });
}

/**
 * Hook to mark messages as read
 */
export function useMarkAsRead(conversationId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAsRead(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.unreadCount() });
      queryClient.invalidateQueries({
        queryKey: messageKeys.conversationList(),
      });
    },
  });
}

/**
 * Hook to delete a message
 */
export function useDeleteMessage(conversationId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: number) => deleteMessage(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: messageKeys.messageList(conversationId),
      });
      toast.success('Message deleted');
    },
    onError: () => {
      toast.error('Failed to delete message');
    },
  });
}

/*
|--------------------------------------------------------------------------
| Inquiry Hooks
|--------------------------------------------------------------------------
*/

/**
 * Hook to fetch inquiries
 */
export function useInquiries(status?: InquiryStatus) {
  return useQuery({
    queryKey: messageKeys.inquiryList(status),
    queryFn: () => getInquiries(status),
    staleTime: 1000 * 60, // 1 minute
  });
}

/**
 * Hook to update inquiry status
 */
export function useUpdateInquiryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: InquiryStatus }) =>
      updateInquiryStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.inquiries() });
      toast.success('Inquiry status updated');
    },
    onError: () => {
      toast.error('Failed to update inquiry status');
    },
  });
}

/**
 * Hook to fetch inquiry stats
 */
export function useInquiryStats() {
  return useQuery({
    queryKey: messageKeys.inquiryStats(),
    queryFn: getInquiryStats,
    staleTime: 1000 * 60, // 1 minute
  });
}
