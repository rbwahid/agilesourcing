'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const subjects = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'sales', label: 'Sales Question' },
  { value: 'support', label: 'Technical Support' },
  { value: 'partnership', label: 'Partnership Opportunity' },
  { value: 'other', label: 'Other' },
];

const socialLinks = [
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/agilesourcing' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/agilesourcing' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/agilesourcing' },
];

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.subject) {
      newErrors.subject = 'Please select a subject';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 max-w-6xl mx-auto">
          {/* Contact Form - Takes more space */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal mb-3">
                Send us a message
              </h2>
              <p className="text-charcoal-light">
                Fill out the form below and we&apos;ll get back to you within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name & Email Row */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-charcoal font-medium">
                    Your Name <span className="text-agile-teal">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Smith"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={cn(
                      'h-12 bg-light-grey border-transparent focus:border-agile-teal focus:bg-white transition-all duration-300',
                      errors.name && 'border-red-500 focus:border-red-500'
                    )}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-charcoal font-medium">
                    Email Address <span className="text-agile-teal">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={cn(
                      'h-12 bg-light-grey border-transparent focus:border-agile-teal focus:bg-white transition-all duration-300',
                      errors.email && 'border-red-500 focus:border-red-500'
                    )}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-charcoal font-medium">
                  Subject <span className="text-agile-teal">*</span>
                </Label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) => handleChange('subject', value)}
                >
                  <SelectTrigger
                    id="subject"
                    className={cn(
                      'w-full h-12 bg-light-grey border-transparent focus:border-agile-teal focus:bg-white transition-all duration-300',
                      errors.subject && 'border-red-500 focus:border-red-500'
                    )}
                  >
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.value} value={subject.value}>
                        {subject.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subject && (
                  <p className="text-sm text-red-500">{errors.subject}</p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-charcoal font-medium">
                  Message <span className="text-agile-teal">*</span>
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell us how we can help you..."
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  rows={6}
                  className={cn(
                    'bg-light-grey border-transparent focus:border-agile-teal focus:bg-white transition-all duration-300 resize-none',
                    errors.message && 'border-red-500 focus:border-red-500'
                  )}
                />
                {errors.message && (
                  <p className="text-sm text-red-500">{errors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-agile-teal hover:bg-agile-teal/90 text-white px-8 py-6 text-base font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-agile-teal/20"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Company Info Card */}
          <div className="lg:col-span-2">
            <div className="bg-light-grey rounded-2xl p-8 lg:p-10 h-full relative overflow-hidden">
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-24 h-24">
                <div className="absolute top-0 right-0 w-full h-full bg-agile-teal/5 rounded-bl-[100px]" />
              </div>

              <h3 className="font-serif text-xl font-semibold text-charcoal mb-8 relative z-10">
                Contact Information
              </h3>

              <div className="space-y-6 relative z-10">
                {/* Email */}
                <a
                  href="mailto:hello@agilesourcing.com"
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:bg-agile-teal/5 transition-all duration-300">
                    <Mail className="w-5 h-5 text-agile-teal" />
                  </div>
                  <div>
                    <p className="text-sm text-charcoal-light mb-1">Email</p>
                    <p className="text-charcoal font-medium group-hover:text-agile-teal transition-colors">
                      hello@agilesourcing.com
                    </p>
                  </div>
                </a>

                {/* Phone */}
                <a
                  href="tel:+14165550123"
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:bg-agile-teal/5 transition-all duration-300">
                    <Phone className="w-5 h-5 text-agile-teal" />
                  </div>
                  <div>
                    <p className="text-sm text-charcoal-light mb-1">Phone</p>
                    <p className="text-charcoal font-medium group-hover:text-agile-teal transition-colors">
                      +1 (416) 555-0123
                    </p>
                  </div>
                </a>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <MapPin className="w-5 h-5 text-agile-teal" />
                  </div>
                  <div>
                    <p className="text-sm text-charcoal-light mb-1">Address</p>
                    <p className="text-charcoal font-medium">
                      350 Bay Street, Suite 700
                      <br />
                      Toronto, ON M5H 2S6
                      <br />
                      Canada
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="my-8 h-px bg-charcoal/10" />

              {/* Social Links */}
              <div>
                <p className="text-sm text-charcoal-light mb-4">Follow us</p>
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm hover:shadow-md hover:bg-agile-teal hover:text-white text-charcoal-light transition-all duration-300"
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Decorative map illustration */}
              <div className="mt-8 rounded-xl bg-white p-4 shadow-sm">
                <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-agile-teal/5 to-mint-accent/10 flex items-center justify-center relative overflow-hidden">
                  {/* Simple map illustration */}
                  <svg
                    viewBox="0 0 200 150"
                    className="w-full h-full opacity-40"
                    preserveAspectRatio="xMidYMid slice"
                  >
                    {/* Grid lines */}
                    {[...Array(8)].map((_, i) => (
                      <line
                        key={`h-${i}`}
                        x1="0"
                        y1={i * 20}
                        x2="200"
                        y2={i * 20}
                        stroke="#00B391"
                        strokeWidth="0.5"
                        opacity="0.3"
                      />
                    ))}
                    {[...Array(10)].map((_, i) => (
                      <line
                        key={`v-${i}`}
                        x1={i * 25}
                        y1="0"
                        x2={i * 25}
                        y2="150"
                        stroke="#00B391"
                        strokeWidth="0.5"
                        opacity="0.3"
                      />
                    ))}
                    {/* Location marker */}
                    <circle cx="100" cy="75" r="8" fill="#00B391" opacity="0.2" />
                    <circle cx="100" cy="75" r="4" fill="#00B391" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-8 h-8 text-agile-teal mx-auto mb-2" />
                      <p className="text-xs text-charcoal-light font-medium">Toronto, Canada</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
