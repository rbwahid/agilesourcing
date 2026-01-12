'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { SidebarItem } from './sidebar-item';
import { PanelLeftClose, PanelLeft } from 'lucide-react';
import type { NavigationItem } from '@/types/navigation';

interface SidebarProps {
  items: NavigationItem[];
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ items, isCollapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-light-grey bg-white transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-[68px]' : 'w-[260px]'
      )}
    >
      {/* Logo Section */}
      <div
        className={cn(
          'flex h-16 items-center border-b border-light-grey px-4 transition-all duration-300',
          isCollapsed && 'justify-center px-2'
        )}
      >
        <Link href="/" className="flex items-center gap-2">
          {isCollapsed ? (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-agile-teal">
              <span className="text-lg font-bold text-white">A</span>
            </div>
          ) : (
            <Image
              src="/agilesourcing-logo.png"
              alt="AgileSourcing"
              width={160}
              height={40}
              className="h-8 w-auto"
              priority
            />
          )}
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {items.map((item) => (
            <SidebarItem
              key={item.href}
              item={item}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>
      </ScrollArea>

      {/* Collapse Toggle */}
      <div className="border-t border-light-grey p-3">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className={cn(
                'w-full justify-start gap-3 text-charcoal-light hover:bg-light-grey hover:text-charcoal',
                isCollapsed && 'justify-center px-2'
              )}
            >
              {isCollapsed ? (
                <PanelLeft className="h-5 w-5" />
              ) : (
                <>
                  <PanelLeftClose className="h-5 w-5" />
                  <span className="text-sm font-medium">Collapse</span>
                </>
              )}
            </Button>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side="right" sideOffset={12}>
              Expand sidebar
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </aside>
  );
}
