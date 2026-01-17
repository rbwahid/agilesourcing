import {
  LandingNavbar,
  ContactHero,
  ContactSection,
  SupportInfo,
  ContactFaq,
  LandingFooter,
} from '@/components/landing';

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <LandingNavbar />
      <ContactHero />
      <ContactSection />
      <SupportInfo />
      <ContactFaq />
      <LandingFooter />
    </main>
  );
}
