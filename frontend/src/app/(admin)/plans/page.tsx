'use client';

import { useState } from 'react';
import { CreditCard, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAdminPlans } from '@/lib/hooks/use-admin';
import { PlansDataTable } from '@/components/admin/plans-data-table';
import { PlanEditDialog } from '@/components/admin/plan-edit-dialog';
import type { AdminPlan } from '@/types/admin';

export default function PlansPage() {
  const { data: plans, isLoading, error, refetch } = useAdminPlans();
  const [editingPlan, setEditingPlan] = useState<AdminPlan | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditPlan = (plan: AdminPlan) => {
    setEditingPlan(plan);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = (open: boolean) => {
    setIsEditDialogOpen(open);
    if (!open) {
      setEditingPlan(null);
    }
  };

  // Calculate summary stats
  const activePlans = plans?.filter((p) => p.is_active) || [];
  const plansWithStripe = plans?.filter((p) => p.has_stripe_ids) || [];
  const totalSubscribers = plans?.reduce((sum, p) => sum + p.active_subscriber_count, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Plan Configuration</h1>
          <p className="text-sm text-charcoal-light">
            Manage subscription plans and pricing. Sync with Stripe to enable subscriptions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Card className="border-gray-100">
            <CardContent className="flex items-center gap-3 py-3 px-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-agile-teal/10">
                <CreditCard className="h-5 w-5 text-agile-teal" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Active Subscribers</p>
                <p className="text-lg font-bold text-charcoal">{totalSubscribers}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Warning for plans not synced with Stripe */}
      {plans && plansWithStripe.length < plans.length && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>{plans.length - plansWithStripe.length} plan(s)</strong> are not synced with
            Stripe. Users cannot subscribe to these plans until they are synced.
          </AlertDescription>
        </Alert>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load plans. Please try again.</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="ml-4"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-gray-100">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Plans</p>
                <p className="text-2xl font-bold text-charcoal">{plans?.length || 0}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                <CreditCard className="h-6 w-6 text-gray-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-100">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Plans</p>
                <p className="text-2xl font-bold text-emerald-600">{activePlans.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                <CreditCard className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-100">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Synced with Stripe</p>
                <p className="text-2xl font-bold text-agile-teal">{plansWithStripe.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-agile-teal/10">
                <CreditCard className="h-6 w-6 text-agile-teal" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plans Table */}
      <PlansDataTable
        plans={plans || []}
        isLoading={isLoading}
        onEditPlan={handleEditPlan}
      />

      {/* Edit Dialog */}
      <PlanEditDialog
        open={isEditDialogOpen}
        onOpenChange={handleCloseEditDialog}
        plan={editingPlan}
      />
    </div>
  );
}
