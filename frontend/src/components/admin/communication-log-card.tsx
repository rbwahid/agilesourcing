'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail, Bell, CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { CommunicationLog, CommunicationType, CommunicationStatus } from '@/types/admin';
import { cn } from '@/lib/utils';

interface CommunicationLogCardProps {
  logs: CommunicationLog[];
  isLoading: boolean;
}

function getTypeIcon(type: CommunicationType) {
  switch (type) {
    case 'email':
      return Mail;
    case 'notification':
      return Bell;
    default:
      return Mail;
  }
}

function getStatusBadge(status: CommunicationStatus) {
  switch (status) {
    case 'sent':
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
          <CheckCircle className="mr-1 h-3 w-3" />
          Sent
        </Badge>
      );
    case 'failed':
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          <XCircle className="mr-1 h-3 w-3" />
          Failed
        </Badge>
      );
    case 'pending':
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function LogSkeleton() {
  return (
    <div className="flex gap-3 border-b border-gray-100 py-3 last:border-b-0">
      <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-5 w-16" />
    </div>
  );
}

export function CommunicationLogCard({ logs, isLoading }: CommunicationLogCardProps) {
  if (isLoading) {
    return (
      <Card className="border-gray-100">
        <CardHeader>
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent>
          {Array.from({ length: 5 }).map((_, i) => (
            <LogSkeleton key={i} />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-100">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-500">Communication History</CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Mail className="h-6 w-6 text-gray-400" />
            </div>
            <p className="font-medium text-charcoal">No Communications Yet</p>
            <p className="mt-1 text-sm text-gray-500">
              Emails and notifications sent to this user will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {logs.map((log) => {
              const Icon = getTypeIcon(log.type);
              return (
                <div
                  key={log.id}
                  className="flex gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                      log.type === 'email' ? 'bg-blue-50' : 'bg-purple-50'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4',
                        log.type === 'email' ? 'text-blue-600' : 'text-purple-600'
                      )}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-charcoal truncate">{log.subject}</p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                          <span className="capitalize">{log.type}</span>
                          <span>•</span>
                          <span>{formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}</span>
                          {log.triggered_by && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {log.triggered_by.name}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      {getStatusBadge(log.status)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
