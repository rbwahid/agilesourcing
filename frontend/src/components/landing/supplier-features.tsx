'use client';

import {
  Layers,
  Search,
  MessageSquare,
  CheckCircle2,
  MapPin,
  Award,
  Camera,
  Filter,
  Globe,
  BadgeCheck,
  BarChart3,
  MessagesSquare,
  FileText,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    title: 'Showcase Your Capabilities',
    description: 'Create a comprehensive profile that highlights your specialties, certifications, and production capacity. Let your work speak for itself.',
    icon: Layers,
    highlights: [
      { icon: CheckCircle2, text: 'Service types (CMT, full production, sampling)' },
      { icon: FileText, text: 'MOQ and lead time specifications' },
      { icon: Award, text: 'Certification badges (GOTS, OEKO-TEX, etc.)' },
      { icon: Camera, text: 'Photo gallery of past work' },
    ],
    mockupType: 'profile',
  },
  {
    title: 'Be Found by the Right Designers',
    description: 'Our matching system connects you with designers searching for exactly what you offer. No more cold outreach—let qualified leads come to you.',
    icon: Search,
    highlights: [
      { icon: Filter, text: 'Filter matching by specialty' },
      { icon: Globe, text: 'Location-based discovery' },
      { icon: BadgeCheck, text: 'Certification requirements alignment' },
      { icon: BarChart3, text: 'MOQ compatibility matching' },
    ],
    mockupType: 'discovery',
  },
  {
    title: 'Build Lasting Partnerships',
    description: 'Message designers directly, respond to inquiries, and manage conversations all in one place. Turn connections into long-term relationships.',
    icon: MessageSquare,
    highlights: [
      { icon: MessagesSquare, text: 'Instant messaging platform' },
      { icon: FileText, text: 'Quote request management' },
      { icon: Clock, text: 'Inquiry tracking dashboard' },
      { icon: TrendingUp, text: 'Response time analytics' },
    ],
    mockupType: 'messaging',
  },
];

function ProfileMockup() {
  return (
    <div className="relative">
      {/* Browser frame */}
      <div className="bg-white rounded-xl shadow-2xl shadow-charcoal/10 overflow-hidden border border-gray-200">
        {/* Browser bar */}
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 mx-4">
            <div className="bg-white rounded-md px-3 py-1.5 text-xs text-gray-400 border border-gray-200">
              agilesourcing.com/supplier/stellar-textiles
            </div>
          </div>
        </div>

        {/* Profile content */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-agile-teal to-mint-accent flex items-center justify-center text-white font-bold text-xl">
              ST
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-charcoal">Stellar Textiles Ltd.</h4>
                <BadgeCheck className="w-5 h-5 text-agile-teal" />
              </div>
              <div className="flex items-center gap-2 text-sm text-charcoal-light">
                <MapPin className="w-4 h-4" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-agile-teal/10 text-agile-teal">
              Full Production
            </span>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
              GOTS Certified
            </span>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
              OEKO-TEX
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-light-grey rounded-lg">
            <div className="text-center">
              <div className="text-lg font-semibold text-charcoal">500</div>
              <div className="text-xs text-charcoal-light">MOQ</div>
            </div>
            <div className="text-center border-x border-gray-200">
              <div className="text-lg font-semibold text-charcoal">4-6 wks</div>
              <div className="text-xs text-charcoal-light">Lead Time</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-charcoal">98%</div>
              <div className="text-xs text-charcoal-light">Response</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating accent */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-agile-teal/10 rounded-full blur-2xl" />
    </div>
  );
}

function DiscoveryMockup() {
  return (
    <div className="relative">
      <div className="bg-white rounded-xl shadow-2xl shadow-charcoal/10 overflow-hidden border border-gray-200">
        {/* Search header */}
        <div className="bg-light-grey p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-gray-200">
            <Search className="w-5 h-5 text-charcoal-light" />
            <span className="text-sm text-charcoal-light">Full production, GOTS certified, Bangladesh...</span>
          </div>
        </div>

        {/* Results */}
        <div className="p-4 space-y-3">
          {/* Result card 1 - highlighted */}
          <div className="p-4 rounded-lg border-2 border-agile-teal bg-agile-teal/5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-agile-teal flex items-center justify-center text-white text-xs font-bold">ST</div>
                <span className="font-medium text-charcoal text-sm">Stellar Textiles</span>
                <BadgeCheck className="w-4 h-4 text-agile-teal" />
              </div>
              <span className="text-xs text-agile-teal font-medium">98% Match</span>
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-0.5 text-xs rounded bg-agile-teal/10 text-agile-teal">Full Production</span>
              <span className="px-2 py-0.5 text-xs rounded bg-emerald-100 text-emerald-600">GOTS</span>
            </div>
          </div>

          {/* Result card 2 */}
          <div className="p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-charcoal/10 flex items-center justify-center text-charcoal text-xs font-bold">GM</div>
                <span className="font-medium text-charcoal text-sm">GreenMill Fabrics</span>
              </div>
              <span className="text-xs text-charcoal-light">85% Match</span>
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-600">CMT</span>
              <span className="px-2 py-0.5 text-xs rounded bg-emerald-100 text-emerald-600">GOTS</span>
            </div>
          </div>

          {/* Result card 3 */}
          <div className="p-4 rounded-lg border border-gray-200 opacity-60">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-charcoal/10 flex items-center justify-center text-charcoal text-xs font-bold">PA</div>
                <span className="font-medium text-charcoal text-sm">PrecisionApparel</span>
              </div>
              <span className="text-xs text-charcoal-light">72% Match</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating accent */}
      <div className="absolute -top-4 -left-4 w-20 h-20 bg-mint-accent/20 rounded-full blur-2xl" />
    </div>
  );
}

function MessagingMockup() {
  return (
    <div className="relative">
      <div className="bg-white rounded-xl shadow-2xl shadow-charcoal/10 overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-charcoal px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-agile-teal flex items-center justify-center text-white text-xs font-bold">EM</div>
            <div>
              <div className="text-sm font-medium text-white">Emma Chen</div>
              <div className="text-xs text-white/60">Sustainable Luxe Studio</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-white/60">Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="p-4 space-y-4 bg-gray-50">
          {/* Incoming */}
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-agile-teal flex items-center justify-center text-white text-xs">E</div>
            <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 text-sm text-charcoal max-w-[200px] shadow-sm">
              Hi! I saw your GOTS certification. Can you handle 1000 units?
            </div>
          </div>

          {/* Outgoing */}
          <div className="flex justify-end">
            <div className="bg-agile-teal rounded-lg rounded-tr-none px-3 py-2 text-sm text-white max-w-[200px]">
              Absolutely! That&apos;s well within our capacity. I&apos;ll send you a quote.
            </div>
          </div>

          {/* Quote card */}
          <div className="flex justify-end">
            <div className="bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200 max-w-[220px]">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-agile-teal" />
                <span className="text-sm font-medium text-charcoal">Quote #2847</span>
              </div>
              <div className="text-xs text-charcoal-light mb-2">1000 units • 4-week lead</div>
              <div className="text-lg font-semibold text-charcoal">$12,500</div>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-sm text-charcoal-light">
              Type a message...
            </div>
            <button className="w-8 h-8 rounded-lg bg-agile-teal flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating accent */}
      <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-agile-teal/10 rounded-full blur-2xl" />
    </div>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export function SupplierFeatures() {
  const mockups = [<ProfileMockup key="profile" />, <DiscoveryMockup key="discovery" />, <MessagingMockup key="messaging" />];

  return (
    <section className="py-24 lg:py-32 bg-light-grey">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block text-sm font-semibold text-agile-teal tracking-wider uppercase mb-4">
            Platform Features
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-charcoal leading-tight">
            Everything You Need to
            <span className="text-agile-teal"> Grow</span>
          </h2>
        </div>

        {/* Features */}
        <div className="space-y-24 lg:space-y-32">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isReversed = index % 2 === 1;

            return (
              <div
                key={feature.title}
                className={cn(
                  'grid lg:grid-cols-2 gap-12 lg:gap-20 items-center',
                  isReversed && 'lg:flex-row-reverse'
                )}
              >
                {/* Content */}
                <div className={cn(isReversed && 'lg:order-2')}>
                  {/* Icon badge */}
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-agile-teal/10 mb-6">
                    <Icon className="w-7 h-7 text-agile-teal" />
                  </div>

                  <h3 className="font-serif text-3xl sm:text-4xl font-semibold text-charcoal mb-4">
                    {feature.title}
                  </h3>

                  <p className="text-lg text-charcoal-light leading-relaxed mb-8">
                    {feature.description}
                  </p>

                  {/* Highlights */}
                  <ul className="space-y-4">
                    {feature.highlights.map((highlight) => {
                      const HighlightIcon = highlight.icon;
                      return (
                        <li key={highlight.text} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-md bg-agile-teal/10 flex items-center justify-center mt-0.5">
                            <HighlightIcon className="w-4 h-4 text-agile-teal" />
                          </div>
                          <span className="text-charcoal">{highlight.text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Mockup */}
                <div className={cn(isReversed && 'lg:order-1')}>
                  {mockups[index]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
