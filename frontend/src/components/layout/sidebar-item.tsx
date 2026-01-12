'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { NavigationItem } from '@/types/navigation';

interface SidebarItemProps {
  item: NavigationItem;
  isCollapsed: boolean;
}

export function SidebarItem({ item, isCollapsed }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  const content = (
    <Link
      href={item.href}
      className={cn(
        'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
        'hover:bg-light-grey',
        isActive
          ? 'bg-agile-teal/5 text-agile-teal'
          : 'text-charcoal-light hover:text-charcoal',
        isCollapsed && 'justify-center px-2'
      )}
    >
      {/* Active indicator bar */}
      <span
        className={cn(
          'absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 rounded-r-full bg-agile-teal transition-all duration-200',
          isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-30'
        )}
      />

      <Icon
        className={cn(
          'h-5 w-5 shrink-0 transition-colors duration-200',
          isActive ? 'text-agile-teal' : 'text-charcoal-light group-hover:text-charcoal'
        )}
      />

      {!isCollapsed && (
        <>
          <span className="truncate">{item.label}</span>
          {item.badge !== undefined && (
            <Badge
              variant="default"
              className="ml-auto h-5 min-w-5 px-1.5 text-[10px] font-semibold"
            >
              {item.badge}
            </Badge>
          )}
        </>
      )}

      {isCollapsed && item.badge !== undefined && (
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-agile-teal text-[9px] font-bold text-white">
          {typeof item.badge === 'number' && item.badge > 9 ? '9+' : item.badge}
        </span>
      )}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={12} className="font-medium">
          {item.label}
          {item.badge !== undefined && (
            <Badge variant="secondary" className="ml-2 text-[10px]">
              {item.badge}
            </Badge>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}
