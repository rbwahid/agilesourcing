'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-white">
      {/* Subtle Background Pattern */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Top-right gradient blob */}
        <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-agile-teal/5 to-mint-accent/10 blur-3xl" />
        {/* Bottom-left gradient blob */}
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-mint-accent/5 to-agile-teal/10 blur-3xl" />
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(#222222 1px, transparent 1px), linear-gradient(90deg, #222222 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Header with Logo */}
      <header className="relative z-10 border-b border-light-grey/50 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/agilesourcing-logo.png"
              alt="AgileSourcing"
              width={140}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </Link>
          <span className="text-sm text-charcoal-light">
            Setting up your profile
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-light-grey/50 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-charcoal-light">
            Need help?{' '}
            <a href="mailto:support@agilesourcing.com" className="text-agile-teal hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
