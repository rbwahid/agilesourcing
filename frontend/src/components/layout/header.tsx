'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { UserMenu } from './user-menu';
import { Menu } from 'lucide-react';
import type { User } from '@/types';

interface HeaderProps {
  user: User;
  onMenuClick: () => void;
}

export function Header({ user, onMenuClick }: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex h-16 items-center justify-between border-b border-light-grey bg-white px-4 lg:px-6'
      )}
    >
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="lg:hidden text-charcoal-light hover:bg-light-grey hover:text-charcoal"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Spacer for desktop */}
      <div className="hidden lg:block" />

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Future: Add notifications, search, etc. here */}
        <UserMenu user={user} />
      </div>
    </header>
  );
}
