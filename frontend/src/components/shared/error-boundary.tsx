'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
    // TODO: Send to error reporting service in production
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          retry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error | null;
  title?: string;
  description?: string;
  retry?: () => void;
  className?: string;
}

export function ErrorFallback({
  error,
  title = 'Something went wrong',
  description,
  retry,
  className,
}: ErrorFallbackProps) {
  const errorMessage =
    description ||
    error?.message ||
    'An unexpected error occurred. Please try again.';

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50/50 px-6 py-16 text-center',
        className
      )}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <AlertTriangle className="h-8 w-8 text-red-600" />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-charcoal">{title}</h3>

      <p className="mb-6 max-w-sm text-sm text-charcoal-light">{errorMessage}</p>

      {retry && (
        <Button
          onClick={retry}
          variant="outline"
          className="border-red-200 text-red-700 hover:bg-red-100"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      )}

      {process.env.NODE_ENV === 'development' && error && (
        <details className="mt-6 w-full max-w-lg text-left">
          <summary className="cursor-pointer text-xs text-charcoal-light hover:text-charcoal">
            Error details (dev only)
          </summary>
          <pre className="mt-2 overflow-auto rounded-lg bg-charcoal p-4 text-xs text-white">
            {error.stack || error.message}
          </pre>
        </details>
      )}
    </div>
  );
}
