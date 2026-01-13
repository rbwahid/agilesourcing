import { apiClient } from './client';
import type {
  Conversation,
  Message,
  Inquiry,
  InquiryStats,
  CreateConversationData,
  ConversationStatus,
  InquiryStatus,
} from '@/types/message';

/*
|--------------------------------------------------------------------------
| Conversation API
|--------------------------------------------------------------------------
*/

/**
 * Get list of conversations
 */
export async function getConversations(
  status?: ConversationStatus | 'all'
): Promise<Conversation[]> {
  const params = status ? `?status=${status}` : '';
  const response = await apiClient.get<{ data: Conversation[] }>(
    `/v1/conversations${params}`
  );
  return response.data.data;
}

/**
 * Get a single conversation
 */
export async function getConversation(id: number): Promise<Conversation> {
  const response = await apiClient.get<{ data: Conversation }>(
    `/v1/conversations/${id}`
  );
  return response.data.data;
}

/**
 * Create a new conversation
 */
export async function createConversation(
  data: CreateConversationData
): Promise<{ message: string; data: Conversation }> {
  const response = await apiClient.post<{
    message: string;
    data: Conversation;
  }>('/v1/conversations', data);
  return response.data;
}

/**
 * Archive a conversation
 */
export async function archiveConversation(
  id: number
): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>(
    `/v1/conversations/${id}/archive`
  );
  return response.data;
}

/**
 * Get unread messages count
 */
export async function getUnreadCount(): Promise<{ unread_count: number }> {
  const response = await apiClient.get<{ unread_count: number }>(
    '/v1/conversations/unread-count'
  );
  return response.data;
}

/*
|--------------------------------------------------------------------------
| Message API
|--------------------------------------------------------------------------
*/

interface MessagesResponse {
  data: Message[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    has_more_pages: boolean;
  };
}

/**
 * Get messages in a conversation
 */
export async function getMessages(
  conversationId: number,
  page: number = 1,
  perPage: number = 50
): Promise<MessagesResponse> {
  const response = await apiClient.get<MessagesResponse>(
    `/v1/conversations/${conversationId}/messages?page=${page}&per_page=${perPage}`
  );
  return response.data;
}

/**
 * Send a message
 */
export async function sendMessage(
  conversationId: number,
  content: string,
  attachments?: File[]
): Promise<{ message: string; data: Message }> {
  const formData = new FormData();
  formData.append('content', content);

  if (attachments?.length) {
    attachments.forEach((file) => {
      formData.append('attachments[]', file);
    });
  }

  const response = await apiClient.post<{
    message: string;
    data: Message;
  }>(`/v1/conversations/${conversationId}/messages`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

/**
 * Mark all messages in a conversation as read
 */
export async function markAsRead(
  conversationId: number
): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>(
    `/v1/conversations/${conversationId}/read`
  );
  return response.data;
}

/**
 * Delete a message
 */
export async function deleteMessage(
  messageId: number
): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>(
    `/v1/messages/${messageId}`
  );
  return response.data;
}

/*
|--------------------------------------------------------------------------
| Inquiry API
|--------------------------------------------------------------------------
*/

/**
 * Get list of inquiries (for suppliers)
 */
export async function getInquiries(status?: InquiryStatus): Promise<Inquiry[]> {
  const params = status ? `?status=${status}` : '';
  const response = await apiClient.get<{ data: Inquiry[] }>(
    `/v1/inquiries${params}`
  );
  return response.data.data;
}

/**
 * Update inquiry status
 */
export async function updateInquiryStatus(
  id: number,
  status: InquiryStatus
): Promise<{ message: string; data: Inquiry }> {
  const response = await apiClient.put<{
    message: string;
    data: Inquiry;
  }>(`/v1/inquiries/${id}/status`, { status });
  return response.data;
}

/**
 * Get inquiry statistics
 */
export async function getInquiryStats(): Promise<InquiryStats> {
  const response = await apiClient.get<InquiryStats>('/v1/inquiries/stats');
  return response.data;
}
