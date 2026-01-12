'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  const isLoginPage = pathname === '/login';
  const isRegisterPage = pathname === '/register';

  // Redirect authenticated users to appropriate dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Determine where to redirect based on role and onboarding status
      if (user.role === 'admin' || user.role === 'super_admin') {
        router.replace('/admin-dashboard');
      } else if (user.role === 'supplier') {
        router.replace('/supplier-dashboard');
      } else if (user.role === 'designer') {
        if (user.profile?.has_completed_onboarding) {
          router.replace('/dashboard');
        } else {
          router.replace('/onboarding');
        }
      } else {
        router.replace('/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Show nothing while checking auth or redirecting
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-grey">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agile-teal" />
      </div>
    );
  }

  // If authenticated, show loading while redirect happens
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-grey">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agile-teal" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Decorative Left Panel */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative bg-charcoal overflow-hidden">
        {/* Subtle textile weave pattern */}
        <div className="absolute inset-0 opacity-10 pattern-weave" />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal-light/20 to-transparent" />

        {/* Decorative diagonal lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-5"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="diagonalLines"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="60"
                x2="60"
                y2="0"
                stroke="currentColor"
                strokeWidth="1"
                className="text-mint-accent"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagonalLines)" />
        </svg>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16">
          {/* Logo */}
          <Link href="/" className="inline-block animate-fade-in">
            <Image
              src="/agilesourcing-logo.png"
              alt="AgileSourcing"
              width={200}
              height={50}
              className="h-10 w-auto brightness-0 invert"
              priority
            />
          </Link>

          {/* Hero Text */}
          <div className="space-y-8 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
            <h1 className="font-serif text-4xl xl:text-5xl 2xl:text-6xl text-white leading-tight">
              Where Fashion
              <br />
              <span className="text-mint-accent italic">Meets Validation</span>
            </h1>
            <p className="text-lg xl:text-xl text-white/70 max-w-md leading-relaxed">
              Transform your design concepts into market-ready collections with
              real consumer insights before production.
            </p>
          </div>

          {/* Bottom decoration */}
          <div
            className="flex items-center gap-4 text-white/40 text-sm animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="w-12 h-px bg-mint-accent/30" />
            <span className="tracking-widest uppercase">Est. 2024</span>
          </div>
        </div>

        {/* Floating geometric elements */}
        <div
          className="absolute top-1/4 right-12 w-32 h-32 border border-mint-accent/20 rotate-45 animate-fade-in"
          style={{ animationDelay: '0.6s' }}
        />
        <div
          className="absolute bottom-1/3 right-24 w-20 h-20 bg-agile-teal/10 animate-fade-in"
          style={{ animationDelay: '0.8s' }}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-light-grey">
        {/* Mobile Header */}
        <header className="lg:hidden px-6 py-4 flex items-center justify-between border-b border-charcoal/5 bg-white">
          <Link href="/">
            <Image
              src="/agilesourcing-logo.png"
              alt="AgileSourcing"
              width={160}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>
          <nav className="flex items-center gap-4">
            {!isLoginPage && (
              <Link
                href="/login"
                className="text-sm text-charcoal-light hover:text-charcoal transition-colors"
              >
                Sign in
              </Link>
            )}
            {!isRegisterPage && (
              <Link
                href="/register"
                className="text-sm bg-agile-teal text-white px-4 py-2 rounded-md hover:bg-agile-teal/90 transition-colors"
              >
                Get Started
              </Link>
            )}
          </nav>
        </header>

        {/* Desktop Navigation */}
        <header className="hidden lg:flex justify-end px-12 py-6 bg-white border-b border-light-grey">
          <nav className="flex items-center gap-6">
            {!isLoginPage && (
              <Link
                href="/login"
                className="text-sm text-charcoal-light hover:text-charcoal transition-colors tracking-wide"
              >
                Sign in
              </Link>
            )}
            {!isRegisterPage && (
              <Link
                href="/register"
                className="text-sm bg-agile-teal text-white px-6 py-2.5 rounded-md hover:bg-agile-teal/90 transition-all duration-300 tracking-wide"
              >
                Create Account
              </Link>
            )}
          </nav>
        </header>

        {/* Form Container */}
        <main className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-md animate-slide-up">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="px-6 py-6 lg:px-12 text-center lg:text-left bg-white border-t border-light-grey">
          <p className="text-xs text-charcoal-light/60 tracking-wide">
            &copy; {new Date().getFullYear()} AgileSourcing. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
