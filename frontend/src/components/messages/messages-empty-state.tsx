'use client';

import { MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MessagesEmptyStateProps {
  variant?: 'no-conversations' | 'no-selection' | 'no-messages';
  onStartConversation?: () => void;
  className?: string;
}

export function MessagesEmptyState({
  variant = 'no-conversations',
  onStartConversation,
  className,
}: MessagesEmptyStateProps) {
  const content = {
    'no-conversations': {
      icon: MessageSquare,
      title: 'No messages yet',
      description:
        'Start connecting with suppliers to discuss your designs and sourcing needs.',
      showButton: true,
    },
    'no-selection': {
      icon: MessageSquare,
      title: 'Select a conversation',
      description: 'Choose a conversation from the list to view messages.',
      showButton: false,
    },
    'no-messages': {
      icon: Send,
      title: 'Start the conversation',
      description: 'Send your first message to begin discussing.',
      showButton: false,
    },
  };

  const { icon: Icon, title, description, showButton } = content[variant];

  return (
    <div
      className={cn(
        'flex h-full flex-col items-center justify-center px-6 py-12',
        className
      )}
    >
      {/* Decorative background pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300B391' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 text-center">
        {/* Icon container with gradient ring */}
        <div className="relative mx-auto mb-6">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-agile-teal/20 to-mint-accent/20 blur-xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-50 to-gray-100 shadow-inner">
            <Icon className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        {/* Title */}
        <h3 className="mb-2 font-serif text-xl font-semibold text-charcoal">
          {title}
        </h3>

        {/* Description */}
        <p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-gray-500">
          {description}
        </p>

        {/* CTA Button */}
        {showButton && onStartConversation && (
          <Button
            onClick={onStartConversation}
            className="gap-2 bg-agile-teal px-6 hover:bg-agile-teal/90"
          >
            <Send className="h-4 w-4" />
            Start a Conversation
          </Button>
        )}
      </div>
    </div>
  );
}
