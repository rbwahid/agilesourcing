'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Upload,
  Sparkles,
  TrendingUp,
  Layers,
  Instagram,
  Building2,
  Phone,
  MessageSquare,
  Download,
  Headphones,
  BarChart3,
  ListChecks,
  Package,
  MessageCircle,
  BadgeCheck,
  Star,
  LineChart,
  Users,
} from 'lucide-react';
import type { PlanFeatures, PlanUserType } from '@/types/admin';
import { cn } from '@/lib/utils';

interface PlanFeaturesEditorProps {
  userType: PlanUserType;
  features: Partial<PlanFeatures>;
  onChange: (features: Partial<PlanFeatures>) => void;
}

interface FeatureItem {
  key: keyof PlanFeatures;
  label: string;
  description: string;
  icon: React.ElementType;
}

interface FeatureCategory {
  name: string;
  features: FeatureItem[];
}

const DESIGNER_FEATURES: FeatureCategory[] = [
  {
    name: 'Design Management',
    features: [
      {
        key: 'design_uploads',
        label: 'Design Uploads',
        description: 'Upload and manage design files',
        icon: Upload,
      },
      {
        key: 'ai_analysis',
        label: 'AI Design Analysis',
        description: 'Get AI-powered feedback on designs',
        icon: Sparkles,
      },
      {
        key: 'trend_scoring',
        label: 'Trend Scoring',
        description: 'Score designs against current trends',
        icon: TrendingUp,
      },
      {
        key: 'design_variations',
        label: 'Design Variations',
        description: 'Generate AI variations of designs',
        icon: Layers,
      },
      {
        key: 'instagram_validation',
        label: 'Instagram Validation',
        description: 'Validate designs against Instagram data',
        icon: Instagram,
      },
    ],
  },
  {
    name: 'Supplier Access',
    features: [
      {
        key: 'supplier_directory',
        label: 'Supplier Directory',
        description: 'Browse the supplier directory',
        icon: Building2,
      },
      {
        key: 'supplier_contact',
        label: 'Contact Suppliers',
        description: 'Send inquiries to suppliers',
        icon: Phone,
      },
      {
        key: 'messaging',
        label: 'Messaging',
        description: 'Direct messaging with suppliers',
        icon: MessageSquare,
      },
    ],
  },
  {
    name: 'Tools & Support',
    features: [
      {
        key: 'export_reports',
        label: 'Export Reports',
        description: 'Export analysis reports',
        icon: Download,
      },
      {
        key: 'priority_support',
        label: 'Priority Support',
        description: '24/7 priority customer support',
        icon: Headphones,
      },
      {
        key: 'advanced_analytics',
        label: 'Advanced Analytics',
        description: 'Detailed analytics dashboard',
        icon: BarChart3,
      },
    ],
  },
];

const SUPPLIER_FEATURES: FeatureCategory[] = [
  {
    name: 'Profile & Catalog',
    features: [
      {
        key: 'profile_listing',
        label: 'Profile Listing',
        description: 'List your business in the directory',
        icon: Building2,
      },
      {
        key: 'product_catalog',
        label: 'Product Catalog',
        description: 'Showcase products and services',
        icon: Package,
      },
      {
        key: 'verification_badge',
        label: 'Verification Badge',
        description: 'Display verified status badge',
        icon: BadgeCheck,
      },
      {
        key: 'featured_listing',
        label: 'Featured Listing',
        description: 'Appear in featured suppliers section',
        icon: Star,
      },
    ],
  },
  {
    name: 'Communication',
    features: [
      {
        key: 'inquiry_management',
        label: 'Inquiry Management',
        description: 'Manage designer inquiries',
        icon: MessageCircle,
      },
      {
        key: 'messaging',
        label: 'Messaging',
        description: 'Direct messaging with designers',
        icon: MessageSquare,
      },
    ],
  },
  {
    name: 'Analytics & Support',
    features: [
      {
        key: 'analytics_dashboard',
        label: 'Analytics Dashboard',
        description: 'View profile and inquiry analytics',
        icon: LineChart,
      },
      {
        key: 'lead_insights',
        label: 'Lead Insights',
        description: 'Detailed insights on incoming leads',
        icon: Users,
      },
      {
        key: 'priority_support',
        label: 'Priority Support',
        description: '24/7 priority customer support',
        icon: Headphones,
      },
    ],
  },
];

export function PlanFeaturesEditor({
  userType,
  features,
  onChange,
}: PlanFeaturesEditorProps) {
  const categories = userType === 'designer' ? DESIGNER_FEATURES : SUPPLIER_FEATURES;

  const handleToggle = (key: keyof PlanFeatures, checked: boolean) => {
    onChange({
      ...features,
      [key]: checked,
    });
  };

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category.name} className="space-y-3">
          <h4 className="text-sm font-medium text-charcoal">{category.name}</h4>
          <div className="grid gap-2">
            {category.features.map((feature) => {
              const Icon = feature.icon;
              const isEnabled = !!features[feature.key];

              return (
                <label
                  key={feature.key}
                  className={cn(
                    'flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors',
                    isEnabled
                      ? 'border-agile-teal/30 bg-agile-teal/5'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <Checkbox
                    checked={isEnabled}
                    onCheckedChange={(checked) =>
                      handleToggle(feature.key, checked as boolean)
                    }
                    className="mt-0.5"
                  />
                  <div
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-md',
                      isEnabled ? 'bg-agile-teal/10' : 'bg-gray-100'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4',
                        isEnabled ? 'text-agile-teal' : 'text-gray-400'
                      )}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        'text-sm font-medium',
                        isEnabled ? 'text-charcoal' : 'text-gray-600'
                      )}
                    >
                      {feature.label}
                    </p>
                    <p className="text-xs text-gray-500">{feature.description}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {/* Feature Count Summary */}
      <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
        <span className="text-sm text-gray-600">Features enabled</span>
        <span className="text-sm font-medium text-charcoal">
          {Object.values(features).filter(Boolean).length} /{' '}
          {categories.reduce((acc, cat) => acc + cat.features.length, 0)}
        </span>
      </div>
    </div>
  );
}
