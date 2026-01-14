'use client';

import { Users, ShieldCheck, CreditCard, HelpCircle, ArrowRight, FileText, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdminStats } from '@/lib/hooks/use-admin';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface QuickActionProps {
  icon: React.ElementType;
  label: string;
  description: string;
  href: string;
  badge?: number;
  badgeVariant?: 'default' | 'destructive' | 'warning';
}

function QuickAction({ icon: Icon, label, description, href, badge, badgeVariant = 'default' }: QuickActionProps) {
  return (
    <Link href={href} className="group block">
      <div className="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-4 transition-all duration-200 hover:border-agile-teal/30 hover:shadow-sm">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50 transition-colors group-hover:bg-agile-teal/10">
          <Icon className="h-5 w-5 text-gray-500 transition-colors group-hover:text-agile-teal" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-charcoal">{label}</p>
            {badge !== undefined && badge > 0 && (
              <Badge
                variant={badgeVariant === 'warning' ? 'outline' : badgeVariant}
                className={cn(
                  'text-xs',
                  badgeVariant === 'warning' && 'border-amber-300 bg-amber-50 text-amber-700'
                )}
              >
                {badge}
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-gray-300 transition-colors group-hover:text-agile-teal" />
      </div>
    </Link>
  );
}

interface AdminQuickActionsProps {
  className?: string;
}

export function AdminQuickActions({ className }: AdminQuickActionsProps) {
  const { data: stats } = useAdminStats();

  const actions: QuickActionProps[] = [
    {
      icon: Users,
      label: 'Manage Users',
      description: 'View, edit, and suspend user accounts',
      href: '/users',
    },
    {
      icon: ShieldCheck,
      label: 'Review Verifications',
      description: 'Approve or reject supplier certifications',
      href: '/verifications',
      badge: stats?.verifications.pending,
      badgeVariant: 'warning',
    },
    {
      icon: CreditCard,
      label: 'View Subscriptions',
      description: 'Monitor active subscriptions and revenue',
      href: '/subscriptions',
    },
    {
      icon: HelpCircle,
      label: 'Support Tickets',
      description: 'Handle customer support requests',
      href: '/support',
    },
  ];

  return (
    <Card className={cn('border-light-grey', className)}>
      <CardHeader>
        <CardTitle className="font-serif text-lg text-charcoal">Management</CardTitle>
        <CardDescription>Platform administration tools</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <QuickAction key={action.href} {...action} />
        ))}
      </CardContent>
    </Card>
  );
}

// Compact version for sidebar or smaller spaces
export function AdminQuickActionsCompact({ className }: AdminQuickActionsProps) {
  const { data: stats } = useAdminStats();

  return (
    <Card className={cn('border-light-grey', className)}>
      <CardHeader>
        <CardTitle className="font-serif text-lg text-charcoal">Management</CardTitle>
        <CardDescription>Platform administration tools</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button variant="outline" className="w-full justify-between" asChild>
          <Link href="/users">
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Manage users
            </span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" className="w-full justify-between" asChild>
          <Link href="/verifications">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Review verifications
              {stats?.verifications.pending && stats.verifications.pending > 0 && (
                <Badge variant="outline" className="ml-1 border-amber-300 bg-amber-50 text-amber-700">
                  {stats.verifications.pending}
                </Badge>
              )}
            </span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" className="w-full justify-between" asChild>
          <Link href="/subscriptions">
            <span className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              View subscriptions
            </span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" className="w-full justify-between" asChild>
          <Link href="/support">
            <span className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Support tickets
            </span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
