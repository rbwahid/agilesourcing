'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  Menu,
  Sparkles,
  Instagram,
  Building2,
} from 'lucide-react';
import { MobileNavDrawer } from './mobile-nav-drawer';
import { cn } from '@/lib/utils';

const features = [
  {
    title: 'AI Design Analysis',
    description: 'Get instant trend insights',
    href: '/features#ai-analysis',
    icon: Sparkles,
  },
  {
    title: 'Instagram Validation',
    description: 'Test with real audiences',
    href: '/features#validation',
    icon: Instagram,
  },
  {
    title: 'Supplier Directory',
    description: '500+ verified partners',
    href: '/features#suppliers',
    icon: Building2,
  },
];

const navLinks = [
  { label: 'For Designers', href: '/for-designers' },
  { label: 'For Suppliers', href: '/for-suppliers' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
];

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm'
            : 'bg-transparent'
        )}
      >
        <nav className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 relative z-10">
              <Image
                src="/agilesourcing-logo.png"
                alt="AgileSourcing"
                width={160}
                height={40}
                className="h-8 lg:h-10 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Features Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button
                  className={cn(
                    'flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                    'hover:bg-charcoal/5',
                    isScrolled ? 'text-charcoal' : 'text-charcoal'
                  )}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  Features
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 transition-transform duration-200',
                      isDropdownOpen && 'rotate-180'
                    )}
                  />
                </button>

                {/* Dropdown Menu */}
                <div
                  className={cn(
                    'absolute top-full left-0 pt-2 transition-all duration-200',
                    isDropdownOpen
                      ? 'opacity-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 -translate-y-2 pointer-events-none'
                  )}
                >
                  <div className="w-72 bg-white rounded-xl shadow-xl shadow-charcoal/10 border border-gray-100 overflow-hidden">
                    <div className="p-2">
                      {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                          <Link
                            key={feature.title}
                            href={feature.href}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-light-grey/50 transition-colors duration-200 group"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-agile-teal/10 flex items-center justify-center group-hover:bg-agile-teal/20 transition-colors duration-200">
                              <Icon className="w-5 h-5 text-agile-teal" />
                            </div>
                            <div>
                              <div className="font-medium text-charcoal text-sm">
                                {feature.title}
                              </div>
                              <div className="text-xs text-charcoal-light">
                                {feature.description}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                    <div className="border-t border-gray-100 p-2">
                      <Link
                        href="/features"
                        className="block px-3 py-2 text-sm font-medium text-agile-teal hover:bg-agile-teal/5 rounded-lg transition-colors duration-200 text-center"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        View All Features →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Other Nav Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                    'hover:bg-charcoal/5',
                    isScrolled ? 'text-charcoal' : 'text-charcoal'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              <Button
                asChild
                variant="ghost"
                className="text-charcoal hover:bg-charcoal/5 font-medium"
              >
                <Link href="/login">Sign In</Link>
              </Button>
              <Button
                asChild
                className="bg-agile-teal hover:bg-agile-teal/90 text-white rounded-full px-6"
              >
                <Link href="/register">Get Started</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 -mr-2 text-charcoal hover:bg-charcoal/5 rounded-lg transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNavDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        features={features}
        navLinks={navLinks}
      />

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16 lg:h-20" />
    </>
  );
}
