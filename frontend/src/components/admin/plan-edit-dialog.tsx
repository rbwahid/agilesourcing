'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CreditCard,
  Loader2,
  Palette,
  Factory,
  DollarSign,
  Infinity,
  Settings2,
} from 'lucide-react';
import { useUpdatePlan } from '@/lib/hooks/use-admin';
import { PlanFeaturesEditor } from './plan-features-editor';
import type { AdminPlan, UpdatePlanData, PlanFeatures } from '@/types/admin';
import { cn } from '@/lib/utils';

interface PlanEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: AdminPlan | null;
}

export function PlanEditDialog({ open, onOpenChange, plan }: PlanEditDialogProps) {
  const [name, setName] = useState('');
  const [priceMonthly, setPriceMonthly] = useState('');
  const [priceAnnual, setPriceAnnual] = useState('');
  const [designUploadsLimit, setDesignUploadsLimit] = useState('');
  const [validationsLimit, setValidationsLimit] = useState('');
  const [unlimitedUploads, setUnlimitedUploads] = useState(false);
  const [unlimitedValidations, setUnlimitedValidations] = useState(false);
  const [features, setFeatures] = useState<Partial<PlanFeatures>>({});

  const updatePlanMutation = useUpdatePlan();

  // Reset form when plan changes
  useEffect(() => {
    if (plan) {
      setName(plan.name);
      setPriceMonthly(plan.price_monthly.toString());
      setPriceAnnual(plan.price_annual.toString());
      setDesignUploadsLimit(plan.design_uploads_limit?.toString() || '');
      setValidationsLimit(plan.validations_limit?.toString() || '');
      setUnlimitedUploads(plan.has_unlimited_uploads);
      setUnlimitedValidations(plan.has_unlimited_validations);
      setFeatures(plan.features || {});
    }
  }, [plan]);

  const handleSubmit = async () => {
    if (!plan) return;

    const data: UpdatePlanData = {
      name,
      price_monthly: parseFloat(priceMonthly),
      price_annual: parseFloat(priceAnnual),
      features,
    };

    // Handle limits (null = unlimited)
    if (!unlimitedUploads && designUploadsLimit) {
      data.design_uploads_limit = parseInt(designUploadsLimit, 10);
    } else if (unlimitedUploads) {
      data.design_uploads_limit = null;
    }

    if (!unlimitedValidations && validationsLimit) {
      data.validations_limit = parseInt(validationsLimit, 10);
    } else if (unlimitedValidations) {
      data.validations_limit = null;
    }

    await updatePlanMutation.mutateAsync({
      id: plan.id,
      data,
    });

    onOpenChange(false);
  };

  const isValid =
    name.trim().length > 0 &&
    parseFloat(priceMonthly) >= 0 &&
    parseFloat(priceAnnual) >= 0;

  if (!plan) return null;

  const isDesignerPlan = plan.user_type === 'designer';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-lg',
                isDesignerPlan ? 'bg-purple-100' : 'bg-indigo-100'
              )}
            >
              <CreditCard
                className={cn('h-6 w-6', isDesignerPlan ? 'text-purple-600' : 'text-indigo-600')}
              />
            </div>
            <div>
              <DialogTitle>Edit Plan</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                {isDesignerPlan ? (
                  <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 gap-1">
                    <Palette className="h-3 w-3" />
                    Designer
                  </Badge>
                ) : (
                  <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 gap-1">
                    <Factory className="h-3 w-3" />
                    Supplier
                  </Badge>
                )}
                <span className="text-gray-500">{plan.slug}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="general" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Pricing & Limits
            </TabsTrigger>
            <TabsTrigger value="features" className="gap-2">
              <Settings2 className="h-4 w-4" />
              Features
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6 pt-4">
            {/* Plan Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Plan Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter plan name"
              />
            </div>

            <Separator />

            {/* Pricing */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-charcoal flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                Pricing
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price-monthly" className="text-sm">
                    Monthly Price (CAD)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="price-monthly"
                      type="number"
                      min="0"
                      step="0.01"
                      value={priceMonthly}
                      onChange={(e) => setPriceMonthly(e.target.value)}
                      className="pl-7"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price-annual" className="text-sm">
                    Annual Price (CAD)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="price-annual"
                      type="number"
                      min="0"
                      step="0.01"
                      value={priceAnnual}
                      onChange={(e) => setPriceAnnual(e.target.value)}
                      className="pl-7"
                    />
                  </div>
                </div>
              </div>
              {parseFloat(priceMonthly) > 0 && parseFloat(priceAnnual) > 0 && (
                <p className="text-xs text-gray-500">
                  Annual savings:{' '}
                  <span className="font-medium text-emerald-600">
                    {Math.round(
                      (1 - parseFloat(priceAnnual) / (parseFloat(priceMonthly) * 12)) * 100
                    )}
                    %
                  </span>
                </p>
              )}
            </div>

            <Separator />

            {/* Usage Limits */}
            {isDesignerPlan && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-charcoal">Usage Limits</h4>

                {/* Design Uploads */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="design-uploads" className="text-sm">
                      Design Uploads Limit
                    </Label>
                    <div className="flex items-center gap-2">
                      <Infinity className="h-4 w-4 text-gray-400" />
                      <Switch
                        id="unlimited-uploads"
                        checked={unlimitedUploads}
                        onCheckedChange={setUnlimitedUploads}
                      />
                      <Label htmlFor="unlimited-uploads" className="text-xs text-gray-500">
                        Unlimited
                      </Label>
                    </div>
                  </div>
                  {!unlimitedUploads && (
                    <Input
                      id="design-uploads"
                      type="number"
                      min="1"
                      value={designUploadsLimit}
                      onChange={(e) => setDesignUploadsLimit(e.target.value)}
                      placeholder="Enter limit"
                    />
                  )}
                </div>

                {/* Validations */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="validations" className="text-sm">
                      Validations Limit
                    </Label>
                    <div className="flex items-center gap-2">
                      <Infinity className="h-4 w-4 text-gray-400" />
                      <Switch
                        id="unlimited-validations"
                        checked={unlimitedValidations}
                        onCheckedChange={setUnlimitedValidations}
                      />
                      <Label htmlFor="unlimited-validations" className="text-xs text-gray-500">
                        Unlimited
                      </Label>
                    </div>
                  </div>
                  {!unlimitedValidations && (
                    <Input
                      id="validations"
                      type="number"
                      min="1"
                      value={validationsLimit}
                      onChange={(e) => setValidationsLimit(e.target.value)}
                      placeholder="Enter limit"
                    />
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="features" className="pt-4">
            <PlanFeaturesEditor
              userType={plan.user_type}
              features={features}
              onChange={setFeatures}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updatePlanMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || updatePlanMutation.isPending}
            className="bg-agile-teal hover:bg-agile-teal/90"
          >
            {updatePlanMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
