'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  User,
  Check,
  CheckCheck,
  Trash2,
  Download,
  FileText,
  ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import type { Message, MessageAttachment } from '@/types/message';
import { formatMessageTime, formatFileSize } from '@/types/message';

interface MessageBubbleProps {
  message: Message;
  showAvatar?: boolean;
  isConsecutive?: boolean;
  onDelete?: (messageId: number) => void;
}

export function MessageBubble({
  message,
  showAvatar = true,
  isConsecutive = false,
  onDelete,
}: MessageBubbleProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isOwn = message.is_own;
  const hasAttachments = message.attachments && message.attachments.length > 0;

  const avatarUrl = message.sender.profile?.avatar_url;
  const senderName =
    message.sender.profile?.company_name ||
    message.sender.profile?.business_name ||
    message.sender.name;

  const initials = senderName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const handleDelete = () => {
    onDelete?.(message.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div
        className={cn(
          'group relative flex gap-2',
          isOwn ? 'flex-row-reverse' : 'flex-row',
          isConsecutive ? 'mt-1' : 'mt-4'
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Avatar (only for other's messages) */}
        {!isOwn && showAvatar && !isConsecutive && (
          <div className="flex-shrink-0">
            <div className="relative h-8 w-8 overflow-hidden rounded-full">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={senderName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  {initials ? (
                    <span className="text-xs font-medium text-gray-600">
                      {initials}
                    </span>
                  ) : (
                    <User className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Spacer for consecutive messages without avatar */}
        {!isOwn && (showAvatar && isConsecutive) && (
          <div className="w-8 flex-shrink-0" />
        )}

        {/* Message content */}
        <div
          className={cn(
            'relative max-w-[75%] min-w-[80px]',
            isOwn ? 'items-end' : 'items-start'
          )}
        >
          {/* Message bubble */}
          <div
            className={cn(
              'relative rounded-2xl px-4 py-2.5 shadow-sm',
              isOwn
                ? 'rounded-br-md bg-agile-teal text-white'
                : 'rounded-bl-md bg-gray-100 text-charcoal',
              isConsecutive && isOwn && 'rounded-tr-md',
              isConsecutive && !isOwn && 'rounded-tl-md'
            )}
          >
            {/* Message text */}
            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
              {message.content}
            </p>

            {/* Attachments */}
            {hasAttachments && (
              <div className="mt-2 space-y-2">
                {message.attachments!.map((attachment, index) => (
                  <AttachmentPreview
                    key={index}
                    attachment={attachment}
                    isOwn={isOwn}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Timestamp and read status */}
          <div
            className={cn(
              'mt-1 flex items-center gap-1',
              isOwn ? 'justify-end' : 'justify-start'
            )}
          >
            <span className="text-[10px] text-gray-400">
              {formatMessageTime(message.created_at)}
            </span>
            {isOwn && (
              <span className="text-gray-400">
                {message.read_at ? (
                  <CheckCheck className="h-3 w-3 text-agile-teal" />
                ) : (
                  <Check className="h-3 w-3" />
                )}
              </span>
            )}
          </div>
        </div>

        {/* Delete button (own messages only) */}
        {isOwn && onDelete && (
          <div
            className={cn(
              'absolute -left-8 top-1/2 -translate-y-1/2 transition-opacity',
              isHovered ? 'opacity-100' : 'opacity-0'
            )}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-gray-400 hover:bg-red-50 hover:text-red-500"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete message?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The message will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

interface AttachmentPreviewProps {
  attachment: MessageAttachment;
  isOwn: boolean;
}

function AttachmentPreview({ attachment, isOwn }: AttachmentPreviewProps) {
  const isImage = attachment.type.startsWith('image/');

  if (isImage) {
    return (
      <a
        href={attachment.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden rounded-lg"
      >
        <div className="relative aspect-video w-full max-w-xs">
          <Image
            src={attachment.url}
            alt={attachment.name}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
        </div>
      </a>
    );
  }

  return (
    <a
      href={attachment.url}
      download={attachment.name}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2 transition-colors',
        isOwn
          ? 'bg-white/10 hover:bg-white/20'
          : 'bg-gray-200 hover:bg-gray-300'
      )}
    >
      <div
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded',
          isOwn ? 'bg-white/20' : 'bg-white'
        )}
      >
        {attachment.type.includes('pdf') ? (
          <FileText className={cn('h-4 w-4', isOwn ? 'text-white' : 'text-red-500')} />
        ) : (
          <ImageIcon
            className={cn('h-4 w-4', isOwn ? 'text-white' : 'text-gray-500')}
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'truncate text-xs font-medium',
            isOwn ? 'text-white' : 'text-charcoal'
          )}
        >
          {attachment.name}
        </p>
        <p
          className={cn(
            'text-[10px]',
            isOwn ? 'text-white/70' : 'text-gray-500'
          )}
        >
          {formatFileSize(attachment.size)}
        </p>
      </div>
      <Download
        className={cn('h-4 w-4 flex-shrink-0', isOwn ? 'text-white/70' : 'text-gray-400')}
      />
    </a>
  );
}
