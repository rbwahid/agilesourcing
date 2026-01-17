'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

/**
 * Hook to handle email verification redirects.
 * Checks for 'verified' query parameter and shows appropriate toast notification.
 * Cleans up the URL after showing the notification.
 */
export function useVerificationHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const verified = searchParams.get('verified');

    if (verified) {
      switch (verified) {
        case 'success':
          toast.success('Email verified successfully!', {
            description: 'Your account is now fully activated.',
          });
          break;
        case 'already':
          toast.info('Email already verified', {
            description: 'Your email was already verified.',
          });
          break;
        case 'invalid':
          toast.error('Invalid verification link', {
            description: 'The verification link is invalid or expired.',
          });
          break;
      }

      // Clean up URL by removing the query param
      const currentPath = window.location.pathname;
      router.replace(currentPath, { scroll: false });
    }
  }, [searchParams, router]);
}
