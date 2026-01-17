'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  description: string;
  sections: Section[];
}

export function LegalPageLayout({
  title,
  lastUpdated,
  description,
  sections,
}: LegalPageLayoutProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.map((s) => s.id))
  );
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Track scroll position for active section and back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);

      // Find which section is currently in view
      const sectionElements = sections.map((section) =>
        document.getElementById(section.id)
      );

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
    setIsMobileTocOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-light-grey border-b border-gray-100">
        <div className="container mx-auto px-6 py-16 lg:py-20">
          <div className="max-w-3xl">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-4">
              {title}
            </h1>
            <p className="text-lg text-charcoal-light mb-6">{description}</p>
            <div className="flex items-center gap-2 text-sm text-charcoal-light">
              <span className="font-medium text-charcoal">Last Updated:</span>
              <time dateTime={lastUpdated}>{lastUpdated}</time>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile TOC Toggle */}
      <div className="lg:hidden sticky top-16 z-30 bg-white border-b border-gray-100">
        <button
          onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
          className="w-full px-6 py-4 flex items-center justify-between text-charcoal font-medium"
        >
          <span>Table of Contents</span>
          <ChevronDown
            className={cn(
              'w-5 h-5 transition-transform duration-200',
              isMobileTocOpen && 'rotate-180'
            )}
          />
        </button>

        {/* Mobile TOC Dropdown */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-300 border-b border-gray-100',
            isMobileTocOpen ? 'max-h-[60vh]' : 'max-h-0'
          )}
        >
          <nav className="px-6 py-4 overflow-y-auto max-h-[60vh] bg-light-grey/50">
            <ol className="space-y-1">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200',
                      activeSection === section.id
                        ? 'bg-agile-teal/10 text-agile-teal font-medium'
                        : 'text-charcoal-light hover:text-charcoal hover:bg-gray-100'
                    )}
                  >
                    <span className="text-charcoal-light mr-2">
                      {index + 1}.
                    </span>
                    {section.title}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-6 py-12 lg:py-16">
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-12">
          {/* Desktop Sidebar TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <h2 className="text-sm font-semibold text-charcoal uppercase tracking-wider mb-4">
                Contents
              </h2>
              <nav>
                <ol className="space-y-1 border-l-2 border-gray-200">
                  {sections.map((section, index) => (
                    <li key={section.id}>
                      <button
                        onClick={() => scrollToSection(section.id)}
                        className={cn(
                          'w-full text-left px-4 py-2 text-sm transition-all duration-200 -ml-[2px] border-l-2',
                          activeSection === section.id
                            ? 'border-agile-teal text-agile-teal font-medium bg-agile-teal/5'
                            : 'border-transparent text-charcoal-light hover:text-charcoal hover:border-gray-400'
                        )}
                      >
                        <span className="text-charcoal-light mr-2">
                          {index + 1}.
                        </span>
                        {section.title}
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          </aside>

          {/* Content Sections */}
          <div ref={contentRef} className="max-w-3xl">
            <div className="space-y-8">
              {sections.map((section, index) => (
                <article
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24"
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between py-4 border-b border-gray-200 group"
                  >
                    <h2 className="font-playfair text-xl md:text-2xl font-semibold text-charcoal text-left">
                      <span className="text-agile-teal mr-3">{index + 1}.</span>
                      {section.title}
                    </h2>
                    <ChevronDown
                      className={cn(
                        'w-5 h-5 text-charcoal-light transition-transform duration-200 group-hover:text-charcoal',
                        expandedSections.has(section.id) && 'rotate-180'
                      )}
                    />
                  </button>

                  <div
                    className={cn(
                      'overflow-hidden transition-all duration-300',
                      expandedSections.has(section.id)
                        ? 'max-h-[2000px] opacity-100'
                        : 'max-h-0 opacity-0'
                    )}
                  >
                    <div className="py-6 prose prose-charcoal max-w-none">
                      {section.content}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={cn(
          'fixed bottom-8 right-8 w-12 h-12 rounded-full bg-agile-teal text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-agile-teal/90 z-40',
          showBackToTop
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        )}
        aria-label="Back to top"
      >
        <ChevronUp className="w-6 h-6" />
      </button>
    </div>
  );
}
