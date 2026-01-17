'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Can I change plans anytime?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any differences. No penalties or hidden fees.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. Enterprise customers can pay via invoice with NET 30 terms.',
  },
  {
    question: 'Is there a free trial for paid plans?',
    answer: 'Yes! All paid plans come with a 14-day free trial. No credit card required to start. Experience the full features before committing.',
  },
  {
    question: 'What happens if I exceed my limits?',
    answer: 'We\'ll notify you when you\'re approaching your limits via email. You can upgrade anytime to get more capacity, or wait until your next billing cycle when limits reset.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 30-day money-back guarantee on all paid plans. If you\'re not satisfied for any reason, contact our support team for a full refund.',
  },
  {
    question: 'Are there discounts for annual billing?',
    answer: 'Yes! Save 20% when you choose annual billing on any paid plan. That\'s like getting over 2 months free compared to monthly billing.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Absolutely. Cancel anytime with no penalties or cancellation fees. You\'ll retain access to all features until the end of your current billing period.',
  },
  {
    question: 'Do you offer team/enterprise plans?',
    answer: 'Yes! Our Studio plan supports up to 5 team members with collaboration features. For larger teams or custom enterprise needs, contact us about our Partner program with dedicated support and custom integrations.',
  },
];

export function PricingFaq() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block text-sm font-semibold text-agile-teal tracking-wider uppercase mb-4">
            FAQ
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal leading-tight mb-6">
            Frequently Asked
            <span className="text-agile-teal"> Questions</span>
          </h2>
          <p className="text-lg text-charcoal-light leading-relaxed">
            Everything you need to know about pricing and billing.
          </p>
        </div>

        {/* FAQ Grid - 2 columns on desktop */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Left Column */}
            <div>
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.slice(0, 4).map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`left-${index}`}
                    className="bg-light-grey rounded-xl border-none px-6 overflow-hidden"
                  >
                    <AccordionTrigger className="text-left text-charcoal font-medium hover:no-underline py-5 text-sm">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-charcoal-light leading-relaxed pb-5 text-sm">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Right Column */}
            <div>
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.slice(4).map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`right-${index}`}
                    className="bg-light-grey rounded-xl border-none px-6 overflow-hidden"
                  >
                    <AccordionTrigger className="text-left text-charcoal font-medium hover:no-underline py-5 text-sm">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-charcoal-light leading-relaxed pb-5 text-sm">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <p className="text-charcoal-light mb-4">
            Still have questions?
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
