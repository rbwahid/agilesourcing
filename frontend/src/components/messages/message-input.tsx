'use client';

import { useState, useRef, useCallback, KeyboardEvent } from 'react';
import { Paperclip, Send, X, FileText, ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { formatFileSize } from '@/types/message';

interface MessageInputProps {
  onSend: (content: string, attachments?: File[]) => void;
  isSending?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const MAX_CHAR_COUNT = 5000;
const MAX_FILES = 5;
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export function MessageInput({
  onSend,
  isSending = false,
  placeholder = 'Type a message...',
  disabled = false,
  className,
}: MessageInputProps) {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charCount = content.length;
  const showCharCount = charCount > 4500;
  const canSend = content.trim().length > 0 || attachments.length > 0;

  const handleSend = useCallback(() => {
    if (!canSend || isSending || disabled) return;

    onSend(content.trim(), attachments.length > 0 ? attachments : undefined);
    setContent('');
    setAttachments([]);

    // Focus textarea after send
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  }, [canSend, isSending, disabled, content, attachments, onSend]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Ctrl/Cmd + Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Filter valid files
    const validFiles = files.filter((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        return false;
      }
      return true;
    });

    // Limit total files
    const newAttachments = [...attachments, ...validFiles].slice(0, MAX_FILES);
    setAttachments(newAttachments);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Auto-resize textarea
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHAR_COUNT) {
      setContent(value);
    }

    // Auto-resize
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  };

  return (
    <div className={cn('border-t border-gray-100 bg-white', className)}>
      {/* Attachment preview row */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 border-b border-gray-50 px-4 py-2">
          {attachments.map((file, index) => (
            <AttachmentChip
              key={index}
              file={file}
              onRemove={() => removeAttachment(index)}
            />
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2 p-4">
        {/* Attachment button */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALLOWED_TYPES.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-10 w-10 flex-shrink-0 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || attachments.length >= MAX_FILES}
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        {/* Textarea */}
        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isSending}
            className={cn(
              'min-h-[44px] max-h-40 resize-none rounded-2xl border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:bg-white',
              'focus:border-agile-teal focus:ring-1 focus:ring-agile-teal/20'
            )}
            rows={1}
          />

          {/* Character count */}
          {showCharCount && (
            <span
              className={cn(
                'absolute bottom-2 right-3 text-xs',
                charCount >= MAX_CHAR_COUNT ? 'text-red-500' : 'text-gray-400'
              )}
            >
              {charCount}/{MAX_CHAR_COUNT}
            </span>
          )}
        </div>

        {/* Send button */}
        <Button
          type="button"
          size="icon"
          className={cn(
            'h-10 w-10 flex-shrink-0 rounded-full transition-all',
            canSend && !disabled
              ? 'bg-agile-teal text-white hover:bg-agile-teal/90'
              : 'bg-gray-100 text-gray-400'
          )}
          onClick={handleSend}
          disabled={!canSend || isSending || disabled}
        >
          {isSending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Keyboard shortcut hint */}
      <div className="pb-2 pr-4 text-right">
        <span className="text-[10px] text-gray-400">
          Press <kbd className="rounded bg-gray-100 px-1 py-0.5 text-[10px]">⌘</kbd>
          <span className="mx-0.5">+</span>
          <kbd className="rounded bg-gray-100 px-1 py-0.5 text-[10px]">Enter</kbd> to send
        </span>
      </div>
    </div>
  );
}

interface AttachmentChipProps {
  file: File;
  onRemove: () => void;
}

function AttachmentChip({ file, onRemove }: AttachmentChipProps) {
  const isImage = file.type.startsWith('image/');

  return (
    <div className="group relative flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 pr-8">
      <div className="flex h-6 w-6 items-center justify-center rounded bg-white">
        {isImage ? (
          <ImageIcon className="h-3.5 w-3.5 text-blue-500" />
        ) : (
          <FileText className="h-3.5 w-3.5 text-red-500" />
        )}
      </div>
      <div className="min-w-0">
        <p className="max-w-[120px] truncate text-xs font-medium text-charcoal">
          {file.name}
        </p>
        <p className="text-[10px] text-gray-400">{formatFileSize(file.size)}</p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
