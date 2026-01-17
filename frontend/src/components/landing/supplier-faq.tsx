'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How do I get verified?',
    answer: 'Verification involves submitting documentation that proves your business credentials, certifications, and manufacturing capabilities. Once submitted, our team reviews your application within 2-3 business days. Verified suppliers receive a badge on their profile and appear higher in search results.',
  },
  {
    question: 'What certifications can I display?',
    answer: 'You can display any legitimate manufacturing or sustainability certifications, including GOTS (Global Organic Textile Standard), OEKO-TEX, Fair Trade, BSCI, ISO certifications, and more. We verify each certification before displaying the badge on your profile.',
  },
  {
    question: 'How do designers find me?',
    answer: 'Designers use our smart search and filtering system to find suppliers based on service type (CMT, full production, etc.), location, certifications, MOQ ranges, lead times, and specialties. The more complete your profile, the more discoverable you become. Verified suppliers and Growth plan members appear higher in search results.',
  },
  {
    question: "What's included in the free plan?",
    answer: 'The Starter (free) plan includes a basic company profile, up to 10 catalog items, standard listing in our directory, direct messaging with designers, and basic inquiry notifications. It\'s perfect for testing the platform and getting started with no upfront commitment.',
  },
  {
    question: 'Can I respond to inquiries on mobile?',
    answer: 'Yes! Our platform is fully responsive and works seamlessly on mobile devices. You can receive notifications, respond to messages, and manage inquiries directly from your phone or tablet. We\'re also developing dedicated mobile apps for an even better experience.',
  },
  {
    question: 'How long does profile setup take?',
    answer: 'Most suppliers complete their basic profile in about 15-20 minutes. This includes company information, service types, certifications, and basic catalog items. You can always add more details and catalog items later. The verification process, if you choose to apply, typically takes 2-3 business days.',
  },
];

export function SupplierFaq() {
  return (
    <section className="py-24 lg:py-32 bg-light-grey">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-agile-teal tracking-wider uppercase mb-4">
            FAQ
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-charcoal leading-tight mb-6">
            Common
            <span className="text-agile-teal"> Questions</span>
          </h2>
          <p className="text-lg text-charcoal-light leading-relaxed">
            Everything you need to know about joining our supplier network.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-xl border border-gray-100 px-6 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <AccordionTrigger className="text-left text-charcoal font-semibold hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-charcoal-light leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <p className="text-charcoal-light mb-4">
            Still have questions? We&apos;re here to help.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 text-agile-teal font-semibold hover:underline"
          >
            Contact our team
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
