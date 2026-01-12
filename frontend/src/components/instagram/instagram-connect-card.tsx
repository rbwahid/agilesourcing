'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Instagram, Loader2, LogOut, RefreshCw, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import {
  useInstagramStatus,
  useConnectInstagram,
  useDisconnectInstagram,
  useRefreshInstagramToken,
} from '@/lib/hooks/use-instagram';

export function InstagramConnectCard() {
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);

  const { data: status, isLoading } = useInstagramStatus();
  const { mutate: connect, isPending: isConnecting } = useConnectInstagram();
  const { mutate: disconnect, isPending: isDisconnecting } = useDisconnectInstagram();
  const { mutate: refreshToken, isPending: isRefreshing } = useRefreshInstagramToken();

  const isConnected = status?.connected && status?.data;
  const connection = status?.data;

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg shadow-gray-200/50 overflow-hidden">
        <div className="h-48 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-agile-teal" />
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-0 shadow-lg shadow-gray-200/50 overflow-hidden">
        {/* Gradient header bar */}
        <div className="h-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737]" />

        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]">
                <Instagram className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">Instagram Connection</CardTitle>
                <CardDescription className="text-sm">
                  {isConnected
                    ? 'Your account is connected'
                    : 'Connect to validate designs'}
                </CardDescription>
              </div>
            </div>

            {/* Connection status indicator */}
            <div
              className={cn(
                'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                isConnected
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-gray-100 text-gray-600'
              )}
            >
              <span
                className={cn(
                  'h-2 w-2 rounded-full',
                  isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                )}
              />
              {isConnected ? 'Connected' : 'Not Connected'}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {isConnected && connection ? (
            <div className="space-y-4">
              {/* Token expiry warning */}
              {connection.is_token_expiring_soon && (
                <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <span>Your connection will expire soon. Please refresh to continue.</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => refreshToken()}
                    disabled={isRefreshing}
                    className="ml-auto h-7 gap-1 text-amber-700 hover:bg-amber-100 hover:text-amber-900"
                  >
                    {isRefreshing ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3 w-3" />
                    )}
                    Refresh
                  </Button>
                </div>
              )}

              {/* Connected account info */}
              <div className="flex items-center gap-4 rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 ring-1 ring-gray-100">
                <div className="relative">
                  {connection.profile_picture_url ? (
                    <Image
                      src={connection.profile_picture_url}
                      alt={connection.instagram_username}
                      width={56}
                      height={56}
                      className="rounded-full ring-2 ring-white shadow-md"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#833AB4] to-[#FD1D1D] text-white font-semibold text-lg shadow-md ring-2 ring-white">
                      {connection.instagram_username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <a
                    href={`https://instagram.com/${connection.instagram_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1 font-semibold text-charcoal hover:text-agile-teal transition-colors"
                  >
                    @{connection.instagram_username}
                    <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                  <p className="text-sm text-gray-500">
                    {connection.followers_count.toLocaleString()} followers
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDisconnectDialog(true)}
                  className="gap-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Disconnect
                </Button>
              </div>

              {/* Connected features */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <p className="text-2xl font-bold text-charcoal">
                    {connection.followers_count >= 1000
                      ? `${(connection.followers_count / 1000).toFixed(1)}k`
                      : connection.followers_count}
                  </p>
                  <p className="text-xs text-gray-500">Followers</p>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-agile-teal/10 to-mint-accent/10 p-3 text-center">
                  <p className="text-2xl font-bold text-agile-teal">Ready</p>
                  <p className="text-xs text-gray-500">For Validation</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Connect your Instagram Business or Creator account to validate your designs
                with real audience engagement.
              </p>

              <ul className="space-y-2 text-sm">
                {[
                  'Post designs directly to Instagram',
                  'Track likes, comments, and saves',
                  'Get engagement-based validation scores',
                  'Compare design performance',
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="h-4 w-4 text-agile-teal flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => connect()}
                disabled={isConnecting}
                className="w-full gap-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 transition-opacity text-white"
              >
                {isConnecting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Instagram className="h-4 w-4" />
                )}
                Connect Instagram
              </Button>

              <p className="text-xs text-gray-400 text-center">
                Requires Instagram Business or Creator account
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disconnect confirmation dialog */}
      <AlertDialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Instagram?</AlertDialogTitle>
            <AlertDialogDescription>
              This will unlink your Instagram account. Any active validations will continue,
              but you won&apos;t be able to start new ones until you reconnect.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDisconnecting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                disconnect();
                setShowDisconnectDialog(false);
              }}
              disabled={isDisconnecting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDisconnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Disconnecting...
                </>
              ) : (
                'Disconnect'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
