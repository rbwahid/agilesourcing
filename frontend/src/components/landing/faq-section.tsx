'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How accurate is the AI design analysis?',
    answer:
      'Our AI has been trained on millions of fashion data points and achieves 87% accuracy in predicting market performance. It analyzes trends, color theory, silhouettes, and market timing to give you actionable insights before you invest in production.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      "Absolutely. There are no long-term contracts or hidden fees. You can upgrade, downgrade, or cancel your subscription at any time from your account settings. If you cancel, you'll retain access until the end of your billing period.",
  },
  {
    question: 'How are suppliers verified?',
    answer:
      'Every supplier goes through a rigorous verification process including business registration checks, certification validation, facility audits (for premium suppliers), and ongoing review monitoring. We verify certifications like GOTS, OEKO-TEX, and Fair Trade directly with issuing bodies.',
  },
  {
    question: 'What file formats are supported?',
    answer:
      'We support all major design formats including PNG, JPG, PDF, AI (Adobe Illustrator), PSD (Photoshop), and SVG. Files up to 50MB are accepted. For best AI analysis results, we recommend high-resolution images (at least 1000px on the shortest side).',
  },
  {
    question: 'Is my design data secure?',
    answer:
      "Your designs are encrypted at rest and in transit using industry-standard AES-256 encryption. We never share your work with third parties, and you retain full ownership of all your intellectual property. Our platform is SOC 2 compliant and we undergo regular security audits.",
  },
  {
    question: 'Do you offer team plans?',
    answer:
      "Team plans are coming soon! In the meantime, Pro users can invite up to 3 collaborators to their workspace. For enterprise pricing with unlimited team members, custom integrations, and dedicated support, please contact our sales team.",
  },
];

export function FaqSection() {
  return (
    <section className="relative py-24 lg:py-32 bg-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-64 h-64 opacity-20">
        <svg viewBox="0 0 200 200" className="w-full h-full text-agile-teal/10">
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
          <span className="inline-block text-sm font-medium text-agile-teal tracking-wider uppercase mb-4">
            FAQ
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-charcoal leading-tight">
            Questions?{' '}
            <span className="text-agile-teal">We've Got Answers</span>
          </h2>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-light-grey/30 rounded-xl border-none px-6 data-[state=open]:bg-agile-teal/5 transition-colors duration-300"
              >
                <AccordionTrigger className="py-6 text-left hover:no-underline group">
                  <span className="font-serif text-lg font-semibold text-charcoal group-hover:text-agile-teal transition-colors duration-300 pr-4">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-charcoal-light leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact CTA */}
        <div className="max-w-3xl mx-auto mt-12 text-center">
          <p className="text-charcoal-light">
            Still have questions?{' '}
            <a
              href="mailto:hello@agilesourcing.ca"
              className="text-agile-teal font-medium hover:text-mint-accent transition-colors duration-300"
            >
              Get in touch
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
