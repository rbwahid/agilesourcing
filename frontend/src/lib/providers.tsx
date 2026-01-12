'use client';

import { QueryClient, QueryClientProvider, MutationCache, QueryCache } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { isValidationError, getErrorMessage } from '@/lib/api/errors';
import { toast } from 'sonner';

/**
 * Global error handler for React Query
 * Handles errors that aren't caught by individual mutation/query error handlers
 */
function handleGlobalError(error: unknown) {
  // Skip validation errors - they should be handled by forms
  if (isValidationError(error)) {
    return;
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Query/Mutation Error:', error);
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: handleGlobalError,
        }),
        mutationCache: new MutationCache({
          onError: handleGlobalError,
        }),
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: (failureCount, error: any) => {
              // Don't retry on 4xx errors
              if (error?.status >= 400 && error?.status < 500) {
                return false;
              }
              return failureCount < 2;
            },
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={4000}
      />
    </QueryClientProvider>
  );
}
