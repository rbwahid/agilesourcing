'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from '@/components/ui/sheet';
import type { NavigationItem } from '@/types/navigation';

interface MobileSidebarProps {
  items: NavigationItem[];
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ items, isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[280px] p-0">
        <SheetHeader className="border-b border-light-grey px-4 py-4">
          <Link href="/" onClick={onClose}>
            <Image
              src="/agilesourcing-logo.png"
              alt="AgileSourcing"
              width={160}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-80px)] px-3 py-4">
          <nav className="flex flex-col gap-1">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200',
                    'active:scale-[0.98]',
                    isActive
                      ? 'bg-agile-teal/5 text-agile-teal'
                      : 'text-charcoal-light hover:bg-light-grey hover:text-charcoal'
                  )}
                >
                  {/* Active indicator */}
                  <span
                    className={cn(
                      'absolute left-0 top-1/2 -translate-y-1/2 h-7 w-0.5 rounded-r-full bg-agile-teal transition-opacity duration-200',
                      isActive ? 'opacity-100' : 'opacity-0'
                    )}
                  />

                  <Icon
                    className={cn(
                      'h-5 w-5 shrink-0',
                      isActive ? 'text-agile-teal' : 'text-charcoal-light'
                    )}
                  />

                  <span>{item.label}</span>

                  {item.badge !== undefined && (
                    <Badge
                      variant="default"
                      className="ml-auto h-5 min-w-5 px-1.5 text-[10px] font-semibold"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
