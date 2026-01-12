'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Sparkles, ArrowRight, Upload, Palette, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { WizardStepContent } from '@/components/forms';

interface StepCompleteProps {
  businessName: string;
  isLoading?: boolean;
  onComplete?: () => void;
}

export function StepComplete({ businessName, isLoading, onComplete }: StepCompleteProps) {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Stagger animations
    const confettiTimer = setTimeout(() => setShowConfetti(true), 200);
    const contentTimer = setTimeout(() => setShowContent(true), 600);

    return () => {
      clearTimeout(confettiTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  const handleGoToDashboard = () => {
    if (onComplete) {
      onComplete();
    } else {
      router.push('/dashboard');
    }
  };

  const nextSteps = [
    {
      icon: Upload,
      title: 'Upload your first design',
      description: 'Get instant feedback from our AI validation system',
    },
    {
      icon: Palette,
      title: 'Explore supplier matches',
      description: 'Connect with manufacturers who fit your style',
    },
    {
      icon: Users,
      title: 'Join the community',
      description: 'Connect with fellow designers and share insights',
    },
  ];

  return (
    <WizardStepContent className="text-center">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={cn(
                'absolute h-2 w-2 rounded-full',
                i % 3 === 0 && 'bg-agile-teal',
                i % 3 === 1 && 'bg-mint-accent',
                i % 3 === 2 && 'bg-agile-teal/50'
              )}
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animation: `confetti-fall ${2 + Math.random() * 2}s ease-out forwards`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
          <style jsx>{`
            @keyframes confetti-fall {
              0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
              }
              100% {
                transform: translateY(400px) rotate(720deg);
                opacity: 0;
              }
            }
          `}</style>
        </div>
      )}

      {/* Success Animation */}
      <div className="mb-8 flex items-center justify-center">
        <div className="relative">
          {/* Pulsing rings */}
          <div
            className={cn(
              'absolute inset-0 -m-4 rounded-full bg-gradient-to-r from-agile-teal/20 to-mint-accent/20 transition-all duration-1000',
              showConfetti ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
            )}
          />
          <div
            className={cn(
              'absolute inset-0 -m-8 rounded-full bg-gradient-to-r from-agile-teal/10 to-mint-accent/10 transition-all duration-1000 delay-300',
              showConfetti ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
            )}
          />

          {/* Main check circle */}
          <div
            className={cn(
              'relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-agile-teal to-mint-accent shadow-2xl shadow-agile-teal/30 transition-all duration-700',
              showConfetti ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            )}
          >
            <Check className="h-12 w-12 text-white" strokeWidth={3} />
          </div>

          {/* Sparkle decorations */}
          <Sparkles
            className={cn(
              'absolute -right-6 -top-2 h-6 w-6 text-agile-teal transition-all duration-500 delay-500',
              showConfetti ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
            )}
          />
          <Sparkles
            className={cn(
              'absolute -bottom-1 -left-5 h-5 w-5 text-mint-accent transition-all duration-500 delay-700',
              showConfetti ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
            )}
          />
        </div>
      </div>

      {/* Welcome Message */}
      <div
        className={cn(
          'space-y-3 transition-all duration-700 delay-300',
          showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        )}
      >
        <h2 className="text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
          Welcome to AgileSourcing!
        </h2>
        <p className="mx-auto max-w-md text-charcoal-light">
          {businessName ? (
            <>
              <span className="font-medium text-agile-teal">{businessName}</span> is all set up.
              You're ready to start your journey.
            </>
          ) : (
            <>Your profile is all set up. You're ready to start your journey.</>
          )}
        </p>
      </div>

      {/* Next Steps */}
      <div
        className={cn(
          'mt-10 space-y-4 transition-all duration-700 delay-500',
          showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        )}
      >
        <h3 className="text-sm font-medium uppercase tracking-wider text-charcoal-light">
          What's Next
        </h3>
        <div className="space-y-3">
          {nextSteps.map((step, index) => (
            <div
              key={step.title}
              className="group flex items-start gap-4 rounded-xl border border-light-grey/50 bg-white p-4 text-left transition-all duration-300 hover:border-agile-teal/30 hover:shadow-md"
              style={{ animationDelay: `${600 + index * 100}ms` }}
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-agile-teal/10 to-mint-accent/10 text-agile-teal transition-colors group-hover:from-agile-teal group-hover:to-mint-accent group-hover:text-white">
                <step.icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-charcoal">{step.title}</h4>
                <p className="text-sm text-charcoal-light">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div
        className={cn(
          'mt-10 transition-all duration-700 delay-700',
          showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        )}
      >
        <Button
          onClick={handleGoToDashboard}
          disabled={isLoading}
          size="lg"
          className={cn(
            'group relative min-w-[200px] gap-2 overflow-hidden rounded-xl px-8 py-6 text-lg font-medium',
            'bg-gradient-to-r from-agile-teal to-mint-accent text-white',
            'hover:opacity-90',
            'focus-visible:ring-2 focus-visible:ring-agile-teal focus-visible:ring-offset-2',
            'transition-all duration-300'
          )}
        >
          {/* Shine Effect */}
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

          <span>Go to Dashboard</span>
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </WizardStepContent>
  );
}
