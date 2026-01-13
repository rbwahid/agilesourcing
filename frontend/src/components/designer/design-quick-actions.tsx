'use client';

import Link from 'next/link';
import { Plus, Activity, Building2, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ActionButtonProps {
  href: string;
  icon: React.ElementType;
  label: string;
  variant?: 'primary' | 'secondary';
}

function ActionButton({ href, icon: Icon, label, variant = 'secondary' }: ActionButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Button
      asChild
      variant={isPrimary ? 'default' : 'outline'}
      className={cn(
        'group relative h-auto gap-2.5 overflow-hidden px-4 py-3 transition-all duration-300',
        isPrimary
          ? 'bg-agile-teal text-white shadow-md hover:bg-agile-teal/90 hover:shadow-lg'
          : 'border-gray-200 bg-white text-charcoal hover:border-agile-teal/30 hover:bg-agile-teal/5'
      )}
    >
      <Link href={href}>
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-105',
            isPrimary ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-agile-teal/10'
          )}
        >
          <Icon
            className={cn(
              'h-4 w-4 transition-colors duration-300',
              isPrimary ? 'text-white' : 'text-gray-600 group-hover:text-agile-teal'
            )}
          />
        </div>
        <span className="font-medium">{label}</span>
      </Link>
    </Button>
  );
}

export function DesignQuickActions() {
  const actions: ActionButtonProps[] = [
    {
      href: '/designs/new',
      icon: Plus,
      label: 'Create Design',
      variant: 'primary',
    },
    {
      href: '/validations',
      icon: Activity,
      label: 'Run Validation',
      variant: 'secondary',
    },
    {
      href: '/suppliers',
      icon: Building2,
      label: 'Browse Suppliers',
      variant: 'secondary',
    },
    {
      href: '/designs',
      icon: Grid3X3,
      label: 'View All Designs',
      variant: 'secondary',
    },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((action) => (
        <ActionButton key={action.label} {...action} />
      ))}
    </div>
  );
}
