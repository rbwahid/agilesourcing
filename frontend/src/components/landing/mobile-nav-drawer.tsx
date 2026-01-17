'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from '@/components/ui/sheet';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Feature {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}

interface NavLink {
  label: string;
  href: string;
}

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  features: Feature[];
  navLinks: NavLink[];
}

export function MobileNavDrawer({
  isOpen,
  onClose,
  features,
  navLinks,
}: MobileNavDrawerProps) {
  const [isFeaturesExpanded, setIsFeaturesExpanded] = useState(false);

  const handleLinkClick = () => {
    onClose();
    setIsFeaturesExpanded(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[400px] p-0 border-l border-gray-100">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <Link href="/" onClick={handleLinkClick}>
                <Image
                  src="/agilesourcing-logo.png"
                  alt="AgileSourcing"
                  width={140}
                  height={35}
                  className="h-8 w-auto"
                />
              </Link>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-charcoal-light hover:text-charcoal hover:bg-light-grey rounded-lg transition-colors duration-200"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </SheetHeader>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6">
            <div className="px-4 space-y-1">
              {/* Features Accordion */}
              <div>
                <button
                  onClick={() => setIsFeaturesExpanded(!isFeaturesExpanded)}
                  className="w-full flex items-center justify-between px-4 py-3 text-charcoal font-medium rounded-lg hover:bg-light-grey/50 transition-colors duration-200"
                >
                  <span>Features</span>
                  <ChevronDown
                    className={cn(
                      'w-5 h-5 text-charcoal-light transition-transform duration-200',
                      isFeaturesExpanded && 'rotate-180'
                    )}
                  />
                </button>

                {/* Features Expanded Content */}
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300',
                    isFeaturesExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  )}
                >
                  <div className="pl-4 py-2 space-y-1">
                    {features.map((feature) => {
                      const Icon = feature.icon;
                      return (
                        <Link
                          key={feature.title}
                          href={feature.href}
                          onClick={handleLinkClick}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-light-grey/50 transition-colors duration-200"
                        >
                          <div className="w-9 h-9 rounded-lg bg-agile-teal/10 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-agile-teal" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-charcoal">
                              {feature.title}
                            </div>
                            <div className="text-xs text-charcoal-light">
                              {feature.description}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                    <Link
                      href="/features"
                      onClick={handleLinkClick}
                      className="block px-4 py-3 text-sm font-medium text-agile-teal rounded-lg hover:bg-agile-teal/5 transition-colors duration-200"
                    >
                      View All Features →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Other Nav Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={handleLinkClick}
                  className="block px-4 py-3 text-charcoal font-medium rounded-lg hover:bg-light-grey/50 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Footer with CTAs */}
          <div className="px-6 py-6 border-t border-gray-100 bg-light-grey/30 space-y-3">
            <Button
              asChild
              variant="outline"
              className="w-full py-6 border-charcoal/20 text-charcoal hover:bg-charcoal hover:text-white rounded-xl"
            >
              <Link href="/login" onClick={handleLinkClick}>
                Sign In
              </Link>
            </Button>
            <Button
              asChild
              className="w-full py-6 bg-agile-teal hover:bg-agile-teal/90 text-white rounded-xl"
            >
              <Link href="/register" onClick={handleLinkClick}>
                Get Started
              </Link>
            </Button>
            <p className="text-center text-xs text-charcoal-light pt-2">
              Free to start. No credit card required.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
