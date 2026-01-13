// Messaging Types for AgileSourcing

export interface Conversation {
  id: number;
  designer_id: number;
  supplier_id: number;
  subject: string | null;
  status: ConversationStatus;
  last_message_at: string | null;
  created_at: string;
  designer: ConversationParticipant;
  supplier: ConversationParticipant;
  latest_message?: Message | null;
  inquiry?: Inquiry | null;
  unread_count: number;
}

export interface ConversationParticipant {
  id: number;
  name: string;
  email: string;
  role: 'designer' | 'supplier';
  profile?: {
    avatar_url: string | null;
    business_name?: string;
    company_name?: string;
  } | null;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  attachments: MessageAttachment[] | null;
  read_at: string | null;
  created_at: string;
  sender: ConversationParticipant;
  is_own: boolean;
}

export interface MessageAttachment {
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Inquiry {
  id: number;
  conversation_id: number;
  design_id: number | null;
  status: InquiryStatus;
  created_at: string;
  updated_at: string;
  conversation?: {
    id: number;
    subject: string | null;
    last_message_at: string | null;
    unread_count: number;
    latest_message?: {
      content: string;
      created_at: string;
    } | null;
  };
  designer?: ConversationParticipant;
  design?: {
    id: number;
    title: string;
    primary_image_url: string | null;
  } | null;
}

export type ConversationStatus = 'active' | 'archived' | 'closed';
export type InquiryStatus = 'new' | 'in_progress' | 'quoted' | 'closed';

export interface CreateConversationData {
  supplier_id: number;
  subject?: string;
  design_id?: number;
  initial_message: string;
}

export interface SendMessageData {
  content: string;
  attachments?: File[];
}

export interface InquiryStats {
  total: number;
  new: number;
  in_progress: number;
  quoted: number;
  closed: number;
}

// Status badge helpers
export const INQUIRY_STATUS_CONFIG = {
  new: {
    label: 'New',
    color: 'blue',
    bgClass: 'bg-blue-50',
    textClass: 'text-blue-700',
    borderClass: 'border-blue-200',
  },
  in_progress: {
    label: 'In Progress',
    color: 'amber',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-700',
    borderClass: 'border-amber-200',
  },
  quoted: {
    label: 'Quoted',
    color: 'green',
    bgClass: 'bg-green-50',
    textClass: 'text-green-700',
    borderClass: 'border-green-200',
  },
  closed: {
    label: 'Closed',
    color: 'gray',
    bgClass: 'bg-gray-50',
    textClass: 'text-gray-600',
    borderClass: 'border-gray-200',
  },
} as const;

export function getInquiryStatusConfig(status: InquiryStatus) {
  return INQUIRY_STATUS_CONFIG[status] || INQUIRY_STATUS_CONFIG.new;
}

// Helper to format relative time
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Helper to format message date separator
export function formatDateSeparator(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (messageDate.getTime() === today.getTime()) return 'Today';
  if (messageDate.getTime() === yesterday.getTime()) return 'Yesterday';

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: messageDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

// Helper to format message time
export function formatMessageTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// Helper to truncate message preview
export function truncateMessage(content: string, maxLength: number = 50): string {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + '...';
}

// Helper to format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
