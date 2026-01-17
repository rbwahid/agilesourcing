'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How quickly will I get a response?',
    answer:
      'We aim to respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly at +1 (416) 555-0123.',
  },
  {
    question: "What's the best way to reach you?",
    answer:
      'Email is the fastest way to reach us for detailed inquiries. For quick questions, our phone line is available during business hours (Mon-Fri, 9am-6pm EST).',
  },
  {
    question: 'Do you offer phone support?',
    answer:
      'Yes! Our phone support is available Monday through Friday, 9am to 6pm EST. Outside these hours, please leave a message or email us and we\'ll get back to you the next business day.',
  },
  {
    question: 'How can I report a bug or technical issue?',
    answer:
      "Select 'Technical Support' in the contact form and describe the issue in detail. Screenshots are helpful! Our technical team will investigate promptly and keep you updated on the resolution.",
  },
  {
    question: "I'm interested in a partnership. Who should I contact?",
    answer:
      "Select 'Partnership Opportunity' in the contact form above. Our partnerships team reviews all inquiries and will reach out within 48 hours if there's a potential fit.",
  },
  {
    question: 'Where is your office located?',
    answer:
      "We're headquartered in Toronto, Canada at 350 Bay Street, Suite 700. While our team primarily works remotely, in-person meetings can be arranged by appointment for enterprise clients and partners.",
  },
];

export function ContactFaq() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-sm font-semibold text-agile-teal tracking-wider uppercase mb-4">
            FAQ
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-charcoal leading-tight mb-4">
            Common{' '}
            <span className="text-agile-teal">Questions</span>
          </h2>
          <p className="text-charcoal-light">
            Quick answers to questions you may have about contacting us.
          </p>
        </div>

        {/* FAQ Grid - 2 columns on desktop */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Left Column */}
            <div>
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.slice(0, 3).map((faq, index) => (
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
                {faqs.slice(3).map((faq, index) => (
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

        {/* Additional Help CTA */}
        <div className="text-center mt-12">
          <p className="text-charcoal-light">
            Still have questions?{' '}
            <a
              href="mailto:hello@agilesourcing.com"
              className="text-agile-teal font-semibold hover:underline"
            >
              Email us directly
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
