'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, User, ArrowRight, Mail, Shield, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAdminUsers } from '@/lib/hooks/use-admin';
import { useDebounce } from '@/lib/hooks/use-debounce';
import type { AdminUser, UserRole } from '@/types/admin';
import { cn } from '@/lib/utils';

function getRoleBadgeVariant(role: UserRole): 'default' | 'secondary' | 'outline' {
  switch (role) {
    case 'super_admin':
      return 'default';
    case 'admin':
      return 'secondary';
    default:
      return 'outline';
  }
}

function getRoleLabel(role: UserRole): string {
  switch (role) {
    case 'super_admin':
      return 'Super Admin';
    case 'admin':
      return 'Admin';
    case 'designer':
      return 'Designer';
    case 'supplier':
      return 'Supplier';
  }
}

function UserResult({ user, onSelect }: { user: AdminUser; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className="flex w-full items-center justify-between rounded-lg border border-gray-200 p-3 text-left transition-colors hover:bg-gray-50"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
          <User className="h-5 w-5 text-gray-500" />
        </div>
        <div>
          <p className="font-medium text-charcoal">{user.name}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Mail className="h-3 w-3" />
            {user.email}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={getRoleBadgeVariant(user.role)}>
          {getRoleLabel(user.role)}
        </Badge>
        <ArrowRight className="h-4 w-4 text-gray-400" />
      </div>
    </button>
  );
}

export function UserLookupWidget() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data, isLoading, isFetching } = useAdminUsers({
    search: debouncedSearch,
    per_page: 5,
  });

  const users = data?.data ?? [];
  const showResults = debouncedSearch.length >= 2;
  const isSearching = isFetching && debouncedSearch !== '';

  const handleSelectUser = (userId: number) => {
    router.push(`/users/${userId}`);
  };

  return (
    <Card className="border-gray-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif text-lg">
          <Search className="h-5 w-5 text-agile-teal" />
          User Lookup
        </CardTitle>
        <CardDescription>
          Search for users by name or email to view their details and communication history.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" />
          )}
        </div>

        {showResults && (
          <div className="space-y-2">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              ))
            ) : users.length === 0 ? (
              <div className="py-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <User className="h-6 w-6 text-gray-400" />
                </div>
                <p className="font-medium text-charcoal">No Users Found</p>
                <p className="mt-1 text-sm text-gray-500">
                  Try a different search term
                </p>
              </div>
            ) : (
              users.map((user) => (
                <UserResult
                  key={user.id}
                  user={user}
                  onSelect={() => handleSelectUser(user.id)}
                />
              ))
            )}
          </div>
        )}

        {!showResults && searchQuery.length > 0 && searchQuery.length < 2 && (
          <p className="text-center text-sm text-gray-500">
            Type at least 2 characters to search
          </p>
        )}
      </CardContent>
    </Card>
  );
}
