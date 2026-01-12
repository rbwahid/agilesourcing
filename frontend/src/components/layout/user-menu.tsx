'use client';

import Link from 'next/link';
import { useLogout } from '@/lib/hooks/use-auth';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import type { User as UserType } from '@/types';

interface UserMenuProps {
  user: UserType;
  showChevron?: boolean;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getRoleBadgeVariant(role: string): 'default' | 'secondary' | 'outline' {
  switch (role) {
    case 'admin':
    case 'super_admin':
      return 'default';
    case 'supplier':
      return 'secondary';
    default:
      return 'outline';
  }
}

function getRoleLabel(role: string): string {
  switch (role) {
    case 'super_admin':
      return 'Super Admin';
    case 'admin':
      return 'Admin';
    case 'supplier':
      return 'Supplier';
    case 'designer':
      return 'Designer';
    default:
      return role;
  }
}

export function UserMenu({ user, showChevron = true }: UserMenuProps) {
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'flex items-center gap-2 rounded-lg p-1.5 transition-colors duration-200',
            'hover:bg-light-grey focus:outline-none focus:ring-2 focus:ring-agile-teal/20'
          )}
        >
          <Avatar className="h-8 w-8 border border-light-grey">
            <AvatarImage src={user.profile?.profile_image_url ?? undefined} alt={user.name} />
            <AvatarFallback className="bg-agile-teal/10 text-xs font-medium text-agile-teal">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          {showChevron && (
            <ChevronDown className="h-4 w-4 text-charcoal-light" />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-charcoal">{user.name}</p>
            <p className="text-xs text-charcoal-light">{user.email}</p>
            <Badge
              variant={getRoleBadgeVariant(user.role)}
              className="mt-1 w-fit text-[10px]"
            >
              {getRoleLabel(user.role)}
            </Badge>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => logout()}
          disabled={isLoggingOut}
          className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isLoggingOut ? 'Signing out...' : 'Sign out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
