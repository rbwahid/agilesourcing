'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {
  CreditCard,
  Check,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Lock,
  Sparkles,
  Calendar,
  Shield,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import {
  usePlans,
  usePaymentMethods,
  useCreateSubscription,
  useChangePlan,
  useCreateSetupIntent,
  useAddPaymentMethod,
} from '@/lib/hooks/use-billing';
import { PricingToggle } from './pricing-toggle';
import type { Plan, BillingPeriod, PaymentMethod } from '@/types/billing';

const STEPS = [
  { id: 1, label: 'Plan', description: 'Choose your plan' },
  { id: 2, label: 'Payment', description: 'Payment method' },
  { id: 3, label: 'Confirm', description: 'Review & confirm' },
];

interface CheckoutWizardProps {
  preselectedPlanSlug?: string;
  preselectedPeriod?: BillingPeriod;
  isChangingPlan?: boolean;
}

export function CheckoutWizard({
  preselectedPlanSlug,
  preselectedPeriod = 'monthly',
  isChangingPlan = false,
}: CheckoutWizardProps) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const [currentStep, setCurrentStep] = useState(preselectedPlanSlug ? 2 : 1);
  const [selectedPlanSlug, setSelectedPlanSlug] = useState<string | null>(
    preselectedPlanSlug || null
  );
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>(preselectedPeriod);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(
    null
  );
  const [useNewCard, setUseNewCard] = useState(false);
  const [cardholderName, setCardholderName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: plans } = usePlans();
  const { data: paymentMethods } = usePaymentMethods();
  const createSubscriptionMutation = useCreateSubscription();
  const changePlanMutation = useChangePlan();
  const createSetupIntentMutation = useCreateSetupIntent();
  const addPaymentMethodMutation = useAddPaymentMethod();

  const selectedPlan = useMemo(
    () => plans?.find((p) => p.slug === selectedPlanSlug),
    [plans, selectedPlanSlug]
  );

  const defaultPaymentMethod = useMemo(
    () => paymentMethods?.find((pm) => pm.is_default),
    [paymentMethods]
  );

  // Auto-select default payment method
  useState(() => {
    if (defaultPaymentMethod && !selectedPaymentMethodId) {
      setSelectedPaymentMethodId(defaultPaymentMethod.id);
    }
  });

  const price = selectedPlan
    ? billingPeriod === 'annual'
      ? selectedPlan.price_annual
      : selectedPlan.price_monthly
    : 0;

  const monthlyEquivalent = selectedPlan
    ? billingPeriod === 'annual'
      ? selectedPlan.price_annual / 12
      : selectedPlan.price_monthly
    : 0;

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return !!selectedPlanSlug;
      case 2:
        if (useNewCard) {
          return !!cardholderName.trim() && !!stripe && !!elements;
        }
        return !!selectedPaymentMethodId;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 3 && canProceedToNext()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!selectedPlan) return;

    setIsProcessing(true);
    setError(null);

    try {
      let paymentMethodId = selectedPaymentMethodId;

      // If using new card, create it first
      if (useNewCard && stripe && elements) {
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          setError('Card element not found');
          return;
        }

        const { client_secret } = await createSetupIntentMutation.mutateAsync();
        const { setupIntent, error: stripeError } = await stripe.confirmCardSetup(
          client_secret,
          {
            payment_method: {
              card: cardElement,
              billing_details: { name: cardholderName },
            },
          }
        );

        if (stripeError) {
          setError(stripeError.message || 'Failed to add card');
          return;
        }

        if (setupIntent?.payment_method) {
          await addPaymentMethodMutation.mutateAsync({
            payment_method_id: setupIntent.payment_method as string,
          });
          paymentMethodId = setupIntent.payment_method as string;
        }
      }

      if (!paymentMethodId) {
        setError('Please select or add a payment method');
        return;
      }

      // Create or change subscription
      if (isChangingPlan) {
        await changePlanMutation.mutateAsync({
          plan_slug: selectedPlan.slug,
          payment_method_id: paymentMethodId,
          billing_period: billingPeriod,
        });
      } else {
        await createSubscriptionMutation.mutateAsync({
          plan_slug: selectedPlan.slug,
          payment_method_id: paymentMethodId,
          billing_period: billingPeriod,
        });
      }

      router.push('/billing?success=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                    currentStep > step.id
                      ? 'border-agile-teal bg-agile-teal text-white'
                      : currentStep === step.id
                      ? 'border-agile-teal bg-white text-agile-teal'
                      : 'border-gray-200 bg-white text-gray-400'
                  )}
                >
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      'text-sm font-medium',
                      currentStep >= step.id ? 'text-charcoal' : 'text-gray-400'
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-400 hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    'mx-4 h-0.5 w-16 sm:w-24 transition-colors',
                    currentStep > step.id ? 'bg-agile-teal' : 'bg-gray-200'
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="border-gray-100 shadow-lg">
        <CardContent className="p-6 sm:p-8">
          {/* Step 1: Plan Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="font-serif text-2xl font-bold text-charcoal">
                  Choose Your Plan
                </h2>
                <p className="mt-2 text-gray-500">
                  Select the plan that best fits your needs
                </p>
              </div>

              <div className="flex justify-center py-4">
                <PricingToggle value={billingPeriod} onChange={setBillingPeriod} />
              </div>

              <RadioGroup
                value={selectedPlanSlug || ''}
                onValueChange={setSelectedPlanSlug}
                className="grid gap-4 sm:grid-cols-2"
              >
                {plans?.map((plan) => (
                  <PlanOption
                    key={plan.id}
                    plan={plan}
                    billingPeriod={billingPeriod}
                    isSelected={selectedPlanSlug === plan.slug}
                  />
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Step 2: Payment Method */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="font-serif text-2xl font-bold text-charcoal">
                  Payment Method
                </h2>
                <p className="mt-2 text-gray-500">
                  Choose how you&apos;d like to pay
                </p>
              </div>

              <div className="space-y-4">
                {/* Existing Payment Methods */}
                {paymentMethods && paymentMethods.length > 0 && (
                  <RadioGroup
                    value={useNewCard ? '' : selectedPaymentMethodId || ''}
                    onValueChange={(value) => {
                      setSelectedPaymentMethodId(value);
                      setUseNewCard(false);
                    }}
                    className="space-y-3"
                  >
                    {paymentMethods.map((pm) => (
                      <PaymentMethodOption
                        key={pm.id}
                        paymentMethod={pm}
                        isSelected={!useNewCard && selectedPaymentMethodId === pm.id}
                      />
                    ))}
                  </RadioGroup>
                )}

                {/* New Card Option */}
                <div
                  className={cn(
                    'rounded-lg border-2 p-4 transition-all cursor-pointer',
                    useNewCard
                      ? 'border-agile-teal bg-agile-teal/5'
                      : 'border-gray-100 hover:border-gray-200'
                  )}
                  onClick={() => setUseNewCard(true)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={cn(
                        'h-4 w-4 rounded-full border-2 flex items-center justify-center',
                        useNewCard ? 'border-agile-teal' : 'border-gray-300'
                      )}
                    >
                      {useNewCard && (
                        <div className="h-2 w-2 rounded-full bg-agile-teal" />
                      )}
                    </div>
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <span className="font-medium text-charcoal">
                      Add New Card
                    </span>
                  </div>

                  {useNewCard && (
                    <div className="space-y-4 pl-7">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Cardholder Name
                        </Label>
                        <Input
                          type="text"
                          placeholder="Name on card"
                          value={cardholderName}
                          onChange={(e) => setCardholderName(e.target.value)}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Card Details</Label>
                        <div className="rounded-lg border border-gray-200 bg-white p-4 transition-colors focus-within:border-agile-teal">
                          <CardElement
                            options={{
                              style: {
                                base: {
                                  fontSize: '16px',
                                  color: '#222222',
                                  fontFamily: 'system-ui, sans-serif',
                                  '::placeholder': { color: '#9CA3AF' },
                                },
                                invalid: { color: '#DC2626' },
                              },
                              hidePostalCode: true,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review & Confirm */}
          {currentStep === 3 && selectedPlan && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="font-serif text-2xl font-bold text-charcoal">
                  Review Your Order
                </h2>
                <p className="mt-2 text-gray-500">
                  Confirm your subscription details
                </p>
              </div>

              {/* Order Summary */}
              <div className="rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Plan</p>
                    <p className="font-serif text-lg font-semibold text-charcoal">
                      {selectedPlan.name}
                    </p>
                  </div>
                  <Badge className="bg-agile-teal/10 text-agile-teal border-agile-teal/20">
                    {billingPeriod === 'annual' ? 'Annual' : 'Monthly'}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {billingPeriod === 'annual'
                      ? 'Billed yearly'
                      : 'Billed monthly'}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-charcoal">${price.toFixed(2)}</span>
                  </div>
                  {billingPeriod === 'annual' && (
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-green-600">Annual savings</span>
                      <span className="text-green-600">
                        -${((selectedPlan.price_monthly * 12 - price).toFixed(2))}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className="font-semibold text-charcoal">Total</span>
                    <span className="font-serif text-xl font-bold text-charcoal">
                      ${price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Trial Notice */}
              {!isChangingPlan && (
                <div className="flex items-start gap-3 rounded-lg bg-blue-50 border border-blue-100 p-4">
                  <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      14-day free trial included
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      You won&apos;t be charged until your trial ends. Cancel anytime.
                    </p>
                  </div>
                </div>
              )}

              {/* Security Note */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <Shield className="h-4 w-4" />
                <span>Secure payment powered by Stripe</span>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-100 p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <Button
              type="button"
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 1 || isProcessing}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>

            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceedToNext()}
                className="bg-agile-teal hover:bg-agile-teal/90 gap-1"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="bg-agile-teal hover:bg-agile-teal/90 gap-2 min-w-[140px]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    {isChangingPlan ? 'Change Plan' : 'Start Trial'}
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface PlanOptionProps {
  plan: Plan;
  billingPeriod: BillingPeriod;
  isSelected: boolean;
}

function PlanOption({ plan, billingPeriod, isSelected }: PlanOptionProps) {
  const price = billingPeriod === 'annual' ? plan.price_annual : plan.price_monthly;
  const monthlyPrice = billingPeriod === 'annual' ? plan.price_annual / 12 : plan.price_monthly;
  const isPremium = plan.slug.includes('premium');

  return (
    <label
      className={cn(
        'relative flex cursor-pointer flex-col rounded-xl border-2 p-5 transition-all',
        isSelected
          ? 'border-agile-teal bg-agile-teal/5 shadow-md'
          : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
      )}
    >
      <RadioGroupItem value={plan.slug} className="sr-only" />

      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-serif font-semibold text-charcoal">{plan.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {isPremium ? 'For power users' : 'Get started'}
          </p>
        </div>
        {isPremium && (
          <Badge className="bg-gradient-to-r from-amber-400 to-amber-500 text-white border-0">
            Premium
          </Badge>
        )}
      </div>

      <div className="mt-4">
        <span className="font-serif text-2xl font-bold text-charcoal">
          ${monthlyPrice.toFixed(0)}
        </span>
        <span className="text-gray-500">/mo</span>
        {billingPeriod === 'annual' && (
          <p className="text-xs text-gray-400 mt-1">
            Billed ${price.toFixed(0)}/year
          </p>
        )}
      </div>

      {/* Selection indicator */}
      <div
        className={cn(
          'absolute top-4 right-4 h-5 w-5 rounded-full border-2 flex items-center justify-center',
          isSelected ? 'border-agile-teal bg-agile-teal' : 'border-gray-300'
        )}
      >
        {isSelected && <Check className="h-3 w-3 text-white" />}
      </div>
    </label>
  );
}

interface PaymentMethodOptionProps {
  paymentMethod: PaymentMethod;
  isSelected: boolean;
}

function PaymentMethodOption({
  paymentMethod,
  isSelected,
}: PaymentMethodOptionProps) {
  const brandLabels: Record<string, string> = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'American Express',
    discover: 'Discover',
  };

  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 transition-all',
        isSelected
          ? 'border-agile-teal bg-agile-teal/5'
          : 'border-gray-100 hover:border-gray-200'
      )}
    >
      <RadioGroupItem value={paymentMethod.id} className="sr-only" />
      <div
        className={cn(
          'h-4 w-4 rounded-full border-2 flex items-center justify-center',
          isSelected ? 'border-agile-teal' : 'border-gray-300'
        )}
      >
        {isSelected && <div className="h-2 w-2 rounded-full bg-agile-teal" />}
      </div>
      <CreditCard className="h-5 w-5 text-gray-400" />
      <div className="flex-1">
        <p className="font-medium text-charcoal">
          {brandLabels[paymentMethod.brand] || paymentMethod.brand} •••• {paymentMethod.last4}
        </p>
        <p className="text-xs text-gray-500">
          Expires {paymentMethod.exp_month.toString().padStart(2, '0')}/{paymentMethod.exp_year}
        </p>
      </div>
      {paymentMethod.is_default && (
        <Badge variant="secondary" className="text-xs">
          Default
        </Badge>
      )}
    </label>
  );
}
