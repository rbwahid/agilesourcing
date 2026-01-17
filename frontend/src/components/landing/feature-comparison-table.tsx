'use client';

import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    category: 'Design & Analysis',
    items: [
      { name: 'Design uploads', starter: '3/month', pro: '20/month', studio: 'Unlimited' },
      { name: 'AI trend analysis', starter: 'Basic', pro: 'Advanced', studio: 'Priority' },
      { name: 'Style recommendations', starter: true, pro: true, studio: true },
      { name: 'Market fit scoring', starter: false, pro: true, studio: true },
    ],
  },
  {
    category: 'Validation',
    items: [
      { name: 'Instagram validations', starter: false, pro: '5/month', studio: 'Unlimited' },
      { name: 'Audience insights', starter: false, pro: true, studio: true },
      { name: 'A/B design testing', starter: false, pro: false, studio: true },
    ],
  },
  {
    category: 'Supplier Network',
    items: [
      { name: 'Supplier directory', starter: 'View only', pro: 'Messaging (10/mo)', studio: 'Unlimited' },
      { name: 'Saved suppliers', starter: '5', pro: '25', studio: 'Unlimited' },
      { name: 'Quote requests', starter: false, pro: '5/month', studio: 'Unlimited' },
    ],
  },
  {
    category: 'Team & Support',
    items: [
      { name: 'Team members', starter: '1', pro: '1', studio: 'Up to 5' },
      { name: 'Support', starter: 'Community', pro: 'Email', studio: 'Priority' },
      { name: 'API access', starter: false, pro: false, studio: true },
      { name: 'Custom integrations', starter: false, pro: false, studio: true },
    ],
  },
];

function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === 'boolean') {
    return value ? (
      <div className="w-6 h-6 rounded-full bg-agile-teal/10 flex items-center justify-center mx-auto">
        <Check className="w-4 h-4 text-agile-teal" />
      </div>
    ) : (
      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
        <X className="w-4 h-4 text-gray-300" />
      </div>
    );
  }
  return <span className="text-charcoal font-medium">{value}</span>;
}

export function FeatureComparisonTable() {
  return (
    <section className="py-16 lg:py-20 bg-light-grey">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-charcoal leading-tight mb-4">
            Compare
            <span className="text-agile-teal"> Features</span>
          </h2>
          <p className="text-lg text-charcoal-light">
            See what&apos;s included in each plan
          </p>
        </div>

        {/* Table */}
        <div className="max-w-5xl mx-auto">
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full min-w-[640px]">
              {/* Header */}
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-4 px-4 text-left text-sm font-semibold text-charcoal w-[40%]">
                    Feature
                  </th>
                  <th className="py-4 px-4 text-center text-sm font-semibold text-charcoal w-[20%]">
                    <div className="inline-flex flex-col items-center">
                      <span>Starter</span>
                      <span className="text-xs font-normal text-charcoal-light">Free</span>
                    </div>
                  </th>
                  <th className="py-4 px-4 text-center text-sm font-semibold text-charcoal w-[20%]">
                    <div className="inline-flex flex-col items-center">
                      <div className="flex items-center gap-1">
                        <span>Pro</span>
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-agile-teal text-white">
                          Popular
                        </span>
                      </div>
                      <span className="text-xs font-normal text-charcoal-light">$29/mo</span>
                    </div>
                  </th>
                  <th className="py-4 px-4 text-center text-sm font-semibold text-charcoal w-[20%]">
                    <div className="inline-flex flex-col items-center">
                      <span>Studio</span>
                      <span className="text-xs font-normal text-charcoal-light">$79/mo</span>
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody>
                {features.map((category) => (
                  <>
                    {/* Category Header */}
                    <tr key={category.category} className="bg-white">
                      <td
                        colSpan={4}
                        className="py-4 px-4 text-sm font-semibold text-charcoal border-b border-gray-100"
                      >
                        {category.category}
                      </td>
                    </tr>

                    {/* Feature Rows */}
                    {category.items.map((item, index) => (
                      <tr
                        key={item.name}
                        className={cn(
                          'border-b border-gray-100 transition-colors duration-200 hover:bg-white',
                          index % 2 === 0 ? 'bg-white/50' : 'bg-white'
                        )}
                      >
                        <td className="py-4 px-4 text-sm text-charcoal-light">
                          {item.name}
                        </td>
                        <td className="py-4 px-4 text-center text-sm">
                          <CellValue value={item.starter} />
                        </td>
                        <td className="py-4 px-4 text-center text-sm bg-agile-teal/[0.02]">
                          <CellValue value={item.pro} />
                        </td>
                        <td className="py-4 px-4 text-center text-sm">
                          <CellValue value={item.studio} />
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
