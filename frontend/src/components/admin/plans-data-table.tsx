'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import {
  Pencil,
  CreditCard,
  Users,
  Palette,
  Factory,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTogglePlanActive } from '@/lib/hooks/use-admin';
import { PlanStripeSyncButton, StripeSyncStatus } from './plan-stripe-sync-button';
import type { AdminPlan, PlanUserType } from '@/types/admin';

interface PlansDataTableProps {
  plans: AdminPlan[];
  isLoading: boolean;
  onEditPlan: (plan: AdminPlan) => void;
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getUserTypeBadge(userType: PlanUserType) {
  switch (userType) {
    case 'designer':
      return (
        <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 gap-1">
          <Palette className="h-3 w-3" />
          Designer
        </Badge>
      );
    case 'supplier':
      return (
        <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 gap-1">
          <Factory className="h-3 w-3" />
          Supplier
        </Badge>
      );
    default:
      return <Badge variant="outline">{userType}</Badge>;
  }
}

function TableRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-20" />
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
      </TableCell>
      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell><Skeleton className="h-6 w-10" /></TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
      </TableCell>
    </TableRow>
  );
}

export function PlansDataTable({
  plans,
  isLoading,
  onEditPlan,
}: PlansDataTableProps) {
  const { mutate: toggleActive, isPending: isToggling } = useTogglePlanActive();

  const handleToggleActive = (plan: AdminPlan, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleActive(plan.id);
  };

  // Group plans by user type
  const designerPlans = plans.filter((p) => p.user_type === 'designer');
  const supplierPlans = plans.filter((p) => p.user_type === 'supplier');

  const renderPlanRow = (plan: AdminPlan) => (
    <TableRow
      key={plan.id}
      className={cn(
        'transition-colors',
        !plan.is_active && 'bg-gray-50/50'
      )}
    >
      <TableCell>
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg',
              plan.user_type === 'designer' ? 'bg-purple-100' : 'bg-indigo-100'
            )}
          >
            <CreditCard
              className={cn(
                'h-5 w-5',
                plan.user_type === 'designer' ? 'text-purple-600' : 'text-indigo-600'
              )}
            />
          </div>
          <div className="min-w-0">
            <p className={cn('font-medium', plan.is_active ? 'text-charcoal' : 'text-gray-400')}>
              {plan.name}
            </p>
            <p className="text-xs text-gray-500">{plan.slug}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-0.5">
          <p className="font-medium text-charcoal">
            {formatPrice(plan.price_monthly)}
            <span className="text-sm font-normal text-gray-500">/mo</span>
          </p>
          <p className="text-xs text-gray-500">
            {formatPrice(plan.price_annual)}/yr
          </p>
        </div>
      </TableCell>
      <TableCell>
        <StripeSyncStatus hasStripeIds={plan.has_stripe_ids} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5 text-sm">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="font-medium text-charcoal">{plan.active_subscriber_count}</span>
          <span className="text-gray-500">/ {plan.subscriber_count}</span>
        </div>
      </TableCell>
      <TableCell>
        <Switch
          checked={plan.is_active}
          onCheckedChange={() => toggleActive(plan.id)}
          disabled={isToggling || (plan.is_active && plan.active_subscriber_count > 0)}
          aria-label={plan.is_active ? 'Deactivate plan' : 'Activate plan'}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <PlanStripeSyncButton
            planId={plan.id}
            hasStripeIds={plan.has_stripe_ids}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEditPlan(plan);
            }}
          >
            <Pencil className="mr-1 h-4 w-4" />
            Edit
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-100 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[280px]">Plan</TableHead>
              <TableHead>Pricing</TableHead>
              <TableHead>Stripe</TableHead>
              <TableHead>Subscribers</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="w-[200px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 6 }).map((_, i) => (
              <TableRowSkeleton key={i} />
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="rounded-lg border border-gray-100 bg-white p-12 text-center">
        <CreditCard className="mx-auto h-12 w-12 text-gray-300" />
        <p className="mt-4 text-gray-500">No plans found</p>
        <p className="text-sm text-gray-400">
          Run the PlansSeeder to create default subscription plans.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Designer Plans */}
      {designerPlans.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {getUserTypeBadge('designer')}
            <span className="text-sm text-gray-500">
              {designerPlans.length} plan{designerPlans.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="rounded-lg border border-gray-100 bg-white">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[280px]">Plan</TableHead>
                  <TableHead>Pricing</TableHead>
                  <TableHead>Stripe</TableHead>
                  <TableHead>Subscribers</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="w-[200px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{designerPlans.map(renderPlanRow)}</TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Supplier Plans */}
      {supplierPlans.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {getUserTypeBadge('supplier')}
            <span className="text-sm text-gray-500">
              {supplierPlans.length} plan{supplierPlans.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="rounded-lg border border-gray-100 bg-white">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[280px]">Plan</TableHead>
                  <TableHead>Pricing</TableHead>
                  <TableHead>Stripe</TableHead>
                  <TableHead>Subscribers</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="w-[200px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{supplierPlans.map(renderPlanRow)}</TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
