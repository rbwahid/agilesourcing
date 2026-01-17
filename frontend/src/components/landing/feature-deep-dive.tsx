'use client';

import { Check, Sparkles, Instagram, Building2, Wand2, MessageSquare, Route } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    id: 'ai-analysis',
    title: 'AI Design Analysis',
    icon: Sparkles,
    gradient: 'from-agile-teal to-mint-accent',
    description:
      'Upload your designs and receive instant AI-powered feedback on trends, market potential, and style recommendations.',
    benefits: [
      'Real-time trend analysis',
      'Color palette insights',
      'Market fit scoring',
      'Style recommendations',
    ],
    useCase: 'Upload your sketch and get instant feedback on trends, colors, and market potential',
    illustration: 'ai',
  },
  {
    id: 'validation',
    title: 'Instagram Validation',
    icon: Instagram,
    gradient: 'from-pink-500 to-purple-500',
    description:
      'Test your designs with real audiences before production. Get genuine feedback from your followers and target market.',
    benefits: [
      'Real audience feedback',
      'A/B design testing',
      'Engagement analytics',
      'Demographic insights',
    ],
    useCase: 'Test designs with your followers before investing in production',
    illustration: 'social',
  },
  {
    id: 'suppliers',
    title: 'Verified Supplier Network',
    icon: Building2,
    gradient: 'from-mint-accent to-agile-teal',
    description:
      'Access our curated network of 500+ verified manufacturers, all vetted for quality, ethics, and reliability.',
    benefits: [
      '500+ vetted suppliers',
      'Certification verification',
      'Ethical manufacturing focus',
      'Global coverage',
    ],
    useCase: 'Find manufacturers that match your values and quality standards',
    illustration: 'network',
  },
  {
    id: 'matching',
    title: 'Intelligent Matching',
    icon: Wand2,
    gradient: 'from-amber-500 to-orange-500',
    description:
      'Our AI analyzes your requirements and matches you with suppliers who fit your production needs, values, and scale.',
    benefits: [
      'AI-powered recommendations',
      'MOQ compatibility',
      'Production capacity matching',
      'Style specialization filters',
    ],
    useCase: 'Get matched with suppliers based on your specific needs and production scale',
    illustration: 'match',
  },
  {
    id: 'communication',
    title: 'Seamless Communication',
    icon: MessageSquare,
    gradient: 'from-blue-500 to-cyan-500',
    description:
      'Manage all your supplier conversations in one place. Request quotes, share files, and track discussions effortlessly.',
    benefits: [
      'Unified inbox',
      'Quote request system',
      'Document sharing',
      'Message history',
    ],
    useCase: 'Manage all supplier conversations in one organized place',
    illustration: 'chat',
  },
  {
    id: 'tracking',
    title: 'Journey Tracking',
    icon: Route,
    gradient: 'from-agile-teal to-emerald-500',
    description:
      'Follow your collection from concept to delivery. Track milestones, monitor progress, and stay on top of every detail.',
    benefits: [
      'Visual timeline',
      'Milestone tracking',
      'Status notifications',
      'Production updates',
    ],
    useCase: 'Watch your collection progress from concept to delivery',
    illustration: 'timeline',
  },
];

// Abstract geometric illustrations for each feature - more prominent and visible
function FeatureIllustration({ type, gradient }: { type: string; gradient: string }) {
  const illustrations: Record<string, React.ReactNode> = {
    ai: (
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
          <linearGradient id="ai-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00B391" />
            <stop offset="100%" stopColor="#2BD5A3" />
          </linearGradient>
        </defs>
        {/* Background glow */}
        <circle cx="200" cy="150" r="100" fill="url(#ai-grad)" opacity="0.08" />
        {/* Central brain/chip shape */}
        <rect x="140" y="90" width="120" height="120" rx="24" fill="url(#ai-grad)" opacity="0.25" />
        <rect x="155" y="105" width="90" height="90" rx="18" fill="url(#ai-grad)" opacity="0.4" />
        <rect x="170" y="120" width="60" height="60" rx="12" fill="url(#ai-grad)" opacity="0.6" />
        {/* Neural connection nodes - top */}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={`top-${i}`}>
            <circle cx={80 + i * 60} cy={40} r="12" fill="url(#ai-grad)" opacity={0.5 + i * 0.1} />
            <line x1={80 + i * 60} y1="52" x2="200" y2="90" stroke="url(#ai-grad)" strokeWidth="2" opacity="0.4" />
          </g>
        ))}
        {/* Neural connection nodes - bottom */}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={`bot-${i}`}>
            <circle cx={80 + i * 60} cy={260} r="10" fill="url(#ai-grad)" opacity={0.4 + i * 0.1} />
            <line x1={80 + i * 60} y1="250" x2="200" y2="210" stroke="url(#ai-grad)" strokeWidth="2" opacity="0.35" />
          </g>
        ))}
        {/* Center sparkle */}
        <circle cx="200" cy="150" r="8" fill="#00B391" />
        <circle cx="200" cy="150" r="16" fill="none" stroke="#00B391" strokeWidth="2" opacity="0.5" />
      </svg>
    ),
    social: (
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
          <linearGradient id="social-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        {/* Phone frame */}
        <rect x="130" y="30" width="140" height="240" rx="24" fill="url(#social-grad)" opacity="0.15" />
        <rect x="130" y="30" width="140" height="240" rx="24" fill="none" stroke="url(#social-grad)" strokeWidth="4" opacity="0.6" />
        <rect x="145" y="55" width="110" height="180" rx="8" fill="url(#social-grad)" opacity="0.1" />
        {/* Instagram-style grid */}
        <rect x="155" y="70" width="40" height="40" rx="6" fill="url(#social-grad)" opacity="0.5" />
        <rect x="200" y="70" width="40" height="40" rx="6" fill="url(#social-grad)" opacity="0.4" />
        <rect x="155" y="115" width="40" height="40" rx="6" fill="url(#social-grad)" opacity="0.35" />
        <rect x="200" y="115" width="40" height="40" rx="6" fill="url(#social-grad)" opacity="0.55" />
        {/* Engagement bar */}
        <rect x="155" y="170" width="85" height="12" rx="6" fill="url(#social-grad)" opacity="0.3" />
        <rect x="155" y="170" width="55" height="12" rx="6" fill="url(#social-grad)" opacity="0.6" />
        {/* Floating hearts */}
        <path d="M70,100 C70,85 90,85 90,100 C90,115 70,130 70,130 C70,130 50,115 50,100 C50,85 70,85 70,100" fill="url(#social-grad)" opacity="0.7" />
        <path d="M330,140 C330,130 345,130 345,140 C345,150 330,160 330,160 C330,160 315,150 315,140 C315,130 330,130 330,140" fill="url(#social-grad)" opacity="0.5" />
        <path d="M90,200 C90,193 100,193 100,200 C100,207 90,214 90,214 C90,214 80,207 80,200 C80,193 90,193 90,200" fill="url(#social-grad)" opacity="0.4" />
        {/* Comment bubbles */}
        <circle cx="320" cy="80" r="25" fill="url(#social-grad)" opacity="0.25" />
        <circle cx="330" cy="95" r="8" fill="url(#social-grad)" opacity="0.2" />
      </svg>
    ),
    network: (
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
          <linearGradient id="network-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2BD5A3" />
            <stop offset="100%" stopColor="#00B391" />
          </linearGradient>
        </defs>
        {/* Central hub */}
        <circle cx="200" cy="150" r="50" fill="url(#network-grad)" opacity="0.3" />
        <circle cx="200" cy="150" r="35" fill="url(#network-grad)" opacity="0.5" />
        <circle cx="200" cy="150" r="20" fill="url(#network-grad)" opacity="0.7" />
        {/* Building nodes around */}
        <g>
          <rect x="50" y="50" width="50" height="65" rx="8" fill="url(#network-grad)" opacity="0.5" />
          <rect x="55" y="55" width="15" height="20" rx="2" fill="white" opacity="0.3" />
          <rect x="75" y="55" width="15" height="20" rx="2" fill="white" opacity="0.3" />
          <line x1="100" y1="82" x2="165" y2="135" stroke="url(#network-grad)" strokeWidth="3" opacity="0.5" />
        </g>
        <g>
          <rect x="300" y="60" width="50" height="60" rx="8" fill="url(#network-grad)" opacity="0.55" />
          <rect x="305" y="65" width="15" height="18" rx="2" fill="white" opacity="0.3" />
          <rect x="325" y="65" width="15" height="18" rx="2" fill="white" opacity="0.3" />
          <line x1="300" y1="90" x2="235" y2="135" stroke="url(#network-grad)" strokeWidth="3" opacity="0.5" />
        </g>
        <g>
          <rect x="60" y="190" width="45" height="55" rx="8" fill="url(#network-grad)" opacity="0.45" />
          <line x1="105" y1="217" x2="165" y2="170" stroke="url(#network-grad)" strokeWidth="3" opacity="0.45" />
        </g>
        <g>
          <rect x="295" y="185" width="55" height="70" rx="8" fill="url(#network-grad)" opacity="0.6" />
          <rect x="300" y="190" width="18" height="22" rx="2" fill="white" opacity="0.3" />
          <rect x="322" y="190" width="18" height="22" rx="2" fill="white" opacity="0.3" />
          <line x1="295" y1="220" x2="235" y2="170" stroke="url(#network-grad)" strokeWidth="3" opacity="0.5" />
        </g>
        {/* Verification badges */}
        <circle cx="85" cy="45" r="12" fill="#00B391" opacity="0.8" />
        <path d="M80,45 L83,48 L90,41" fill="none" stroke="white" strokeWidth="2" />
        <circle cx="335" cy="55" r="10" fill="#00B391" opacity="0.7" />
        <path d="M331,55 L333,57 L339,51" fill="none" stroke="white" strokeWidth="2" />
      </svg>
    ),
    match: (
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
          <linearGradient id="match-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
        {/* Left circle - Designer */}
        <circle cx="110" cy="150" r="60" fill="url(#match-grad)" opacity="0.2" />
        <circle cx="110" cy="150" r="45" fill="url(#match-grad)" opacity="0.35" />
        <circle cx="110" cy="150" r="30" fill="url(#match-grad)" opacity="0.5" />
        {/* Right circle - Supplier */}
        <circle cx="290" cy="150" r="60" fill="url(#match-grad)" opacity="0.2" />
        <circle cx="290" cy="150" r="45" fill="url(#match-grad)" opacity="0.35" />
        <circle cx="290" cy="150" r="30" fill="url(#match-grad)" opacity="0.5" />
        {/* Connection beams */}
        <path d="M155,130 Q200,100 245,130" fill="none" stroke="url(#match-grad)" strokeWidth="6" opacity="0.6" />
        <path d="M155,150 Q200,150 245,150" fill="none" stroke="url(#match-grad)" strokeWidth="8" opacity="0.7" />
        <path d="M155,170 Q200,200 245,170" fill="none" stroke="url(#match-grad)" strokeWidth="6" opacity="0.6" />
        {/* Center sparkle/match point */}
        <circle cx="200" cy="150" r="18" fill="url(#match-grad)" opacity="0.8" />
        <circle cx="200" cy="150" r="10" fill="white" opacity="0.9" />
        {/* Floating sparkles */}
        <circle cx="200" cy="110" r="5" fill="#f59e0b" opacity="0.6" />
        <circle cx="200" cy="190" r="5" fill="#f97316" opacity="0.6" />
        <circle cx="170" cy="130" r="3" fill="#f59e0b" opacity="0.5" />
        <circle cx="230" cy="170" r="3" fill="#f97316" opacity="0.5" />
        {/* Magic wand */}
        <line x1="170" y1="60" x2="220" y2="40" stroke="url(#match-grad)" strokeWidth="5" opacity="0.7" strokeLinecap="round" />
        <circle cx="225" cy="37" r="8" fill="url(#match-grad)" opacity="0.8" />
      </svg>
    ),
    chat: (
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
          <linearGradient id="chat-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        {/* Main chat bubble - left */}
        <rect x="60" y="50" width="160" height="80" rx="20" fill="url(#chat-grad)" opacity="0.5" />
        <polygon points="80,130 100,155 120,130" fill="url(#chat-grad)" opacity="0.5" />
        <rect x="80" y="70" width="100" height="10" rx="5" fill="white" opacity="0.5" />
        <rect x="80" y="90" width="70" height="10" rx="5" fill="white" opacity="0.4" />
        {/* Reply bubble - right */}
        <rect x="180" y="140" width="170" height="80" rx="20" fill="url(#chat-grad)" opacity="0.6" />
        <polygon points="320,220 300,245 280,220" fill="url(#chat-grad)" opacity="0.6" />
        <rect x="200" y="160" width="120" height="10" rx="5" fill="white" opacity="0.5" />
        <rect x="200" y="180" width="80" height="10" rx="5" fill="white" opacity="0.4" />
        {/* Small bubble */}
        <rect x="90" y="220" width="100" height="50" rx="16" fill="url(#chat-grad)" opacity="0.35" />
        <rect x="105" y="235" width="60" height="8" rx="4" fill="white" opacity="0.4" />
        {/* Typing indicator */}
        <circle cx="115" cy="255" r="4" fill="white" opacity="0.5" />
        <circle cx="130" cy="255" r="4" fill="white" opacity="0.4" />
        <circle cx="145" cy="255" r="4" fill="white" opacity="0.3" />
        {/* File attachment */}
        <rect x="300" y="50" width="50" height="65" rx="10" fill="url(#chat-grad)" opacity="0.4" />
        <rect x="310" y="60" width="30" height="35" rx="4" fill="white" opacity="0.4" />
        <rect x="315" y="100" width="20" height="6" rx="3" fill="white" opacity="0.3" />
      </svg>
    ),
    timeline: (
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
          <linearGradient id="timeline-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00B391" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        {/* Main timeline line */}
        <line x1="40" y1="150" x2="360" y2="150" stroke="url(#timeline-grad)" strokeWidth="6" opacity="0.4" strokeLinecap="round" />
        {/* Milestone 1 - Complete */}
        <circle cx="80" cy="150" r="22" fill="url(#timeline-grad)" opacity="0.8" />
        <path d="M70,150 L77,157 L92,142" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="55" y="70" width="50" height="55" rx="10" fill="url(#timeline-grad)" opacity="0.35" />
        <line x1="80" y1="128" x2="80" y2="125" stroke="url(#timeline-grad)" strokeWidth="2" opacity="0.5" />
        {/* Milestone 2 - Complete */}
        <circle cx="160" cy="150" r="22" fill="url(#timeline-grad)" opacity="0.7" />
        <path d="M150,150 L157,157 L172,142" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="135" y="180" width="50" height="55" rx="10" fill="url(#timeline-grad)" opacity="0.3" />
        <line x1="160" y1="172" x2="160" y2="180" stroke="url(#timeline-grad)" strokeWidth="2" opacity="0.5" />
        {/* Milestone 3 - Current */}
        <circle cx="240" cy="150" r="22" fill="url(#timeline-grad)" opacity="0.6" />
        <circle cx="240" cy="150" r="8" fill="white" opacity="0.8" />
        <rect x="215" y="70" width="50" height="55" rx="10" fill="url(#timeline-grad)" opacity="0.25" />
        <line x1="240" y1="128" x2="240" y2="125" stroke="url(#timeline-grad)" strokeWidth="2" opacity="0.5" />
        {/* Milestone 4 - Upcoming */}
        <circle cx="320" cy="150" r="22" fill="url(#timeline-grad)" opacity="0.35" />
        <circle cx="320" cy="150" r="22" fill="none" stroke="url(#timeline-grad)" strokeWidth="3" strokeDasharray="6 4" opacity="0.5" />
        <rect x="295" y="180" width="50" height="55" rx="10" fill="url(#timeline-grad)" opacity="0.2" />
        <line x1="320" y1="172" x2="320" y2="180" stroke="url(#timeline-grad)" strokeWidth="2" opacity="0.4" />
      </svg>
    ),
  };

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-light-grey to-white overflow-hidden border border-gray-200 shadow-lg">
      {/* Background gradient overlay */}
      <div className={cn('absolute inset-0 opacity-10 bg-gradient-to-br', gradient)} />
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #222222 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      {/* Illustration */}
      <div className="absolute inset-6">
        {illustrations[type]}
      </div>
    </div>
  );
}

export function FeatureDeepDive() {
  return (
    <div>
      {features.map((feature, index) => {
        const Icon = feature.icon;
        const isReversed = index % 2 === 1;

        return (
          <section
            key={feature.id}
            id={feature.id}
            className={cn(
              'py-20 lg:py-28 scroll-mt-20',
              index % 2 === 0 ? 'bg-white' : 'bg-light-grey'
            )}
          >
            <div className="container mx-auto px-6">
              <div
                className={cn(
                  'grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto',
                  isReversed && 'lg:flex lg:flex-row-reverse'
                )}
              >
                {/* Illustration */}
                <div className={cn('order-1', isReversed ? 'lg:order-2' : 'lg:order-1')}>
                  <FeatureIllustration type={feature.illustration} gradient={feature.gradient} />
                </div>

                {/* Content */}
                <div className={cn('order-2', isReversed ? 'lg:order-1' : 'lg:order-2')}>
                  {/* Icon */}
                  <div className="mb-6">
                    <div
                      className={cn(
                        'inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br',
                        feature.gradient
                      )}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal leading-tight mb-6">
                    {feature.title}
                  </h2>

                  {/* Description */}
                  <p className="text-lg text-charcoal-light leading-relaxed mb-8">
                    {feature.description}
                  </p>

                  {/* Benefits */}
                  <ul className="space-y-3 mb-8">
                    {feature.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-3">
                        <div className={cn('w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-br', feature.gradient)}>
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-charcoal font-medium">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Use Case Quote */}
                  <blockquote className="relative pl-6 border-l-2 border-agile-teal/30">
                    <span className="absolute -left-2 -top-2 text-4xl text-agile-teal/20 font-serif">&ldquo;</span>
                    <p className="text-lg italic text-charcoal-light leading-relaxed">
                      {feature.useCase}
                    </p>
                  </blockquote>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
