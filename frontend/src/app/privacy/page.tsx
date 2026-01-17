import { LandingNavbar, LandingFooter, LegalPageLayout } from '@/components/landing';

const sections = [
  {
    id: 'introduction',
    title: 'Introduction',
    content: (
      <>
        <p>
          Welcome to AgileSourcing. We are committed to protecting your privacy
          and ensuring the security of your personal information. This Privacy
          Policy explains how we collect, use, disclose, and safeguard your
          information when you use our platform.
        </p>
        <p>
          AgileSourcing (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
          operates the AgileSourcing platform, which connects fashion designers
          with manufacturing suppliers. This policy applies to all users of our
          website, mobile applications, and services.
        </p>
        <p>
          By using our services, you agree to the collection and use of
          information in accordance with this policy. If you do not agree with
          this policy, please do not use our services.
        </p>
      </>
    ),
  },
  {
    id: 'information-we-collect',
    title: 'Information We Collect',
    content: (
      <>
        <p>We collect several types of information to provide and improve our services:</p>

        <h3>Account Information</h3>
        <ul>
          <li>Name and email address</li>
          <li>Password (encrypted)</li>
          <li>Phone number (optional)</li>
          <li>Profile photo (optional)</li>
        </ul>

        <h3>Profile Information</h3>
        <ul>
          <li>Company or brand name</li>
          <li>Role (designer or supplier)</li>
          <li>Business address</li>
          <li>Portfolio or catalog information</li>
        </ul>

        <h3>Design Uploads</h3>
        <ul>
          <li>Design images and files you upload for AI analysis</li>
          <li>Product specifications and requirements</li>
          <li>Production preferences</li>
        </ul>

        <h3>Usage Data</h3>
        <ul>
          <li>Pages visited and features used</li>
          <li>Search queries</li>
          <li>Interaction with suppliers or designers</li>
          <li>Time spent on the platform</li>
        </ul>

        <h3>Device Information</h3>
        <ul>
          <li>Browser type and version</li>
          <li>Operating system</li>
          <li>IP address</li>
          <li>Device identifiers</li>
        </ul>
      </>
    ),
  },
  {
    id: 'how-we-use-information',
    title: 'How We Use Your Information',
    content: (
      <>
        <p>We use the information we collect for the following purposes:</p>

        <h3>Providing Our Services</h3>
        <ul>
          <li>Create and manage your account</li>
          <li>Process your design uploads and AI analysis requests</li>
          <li>Match you with suitable suppliers or designers</li>
          <li>Facilitate communication between users</li>
        </ul>

        <h3>AI Analysis</h3>
        <ul>
          <li>Analyze your designs for trend insights</li>
          <li>Generate production recommendations</li>
          <li>Provide market validation data</li>
        </ul>

        <h3>Communication</h3>
        <ul>
          <li>Send service-related notifications</li>
          <li>Respond to your inquiries and support requests</li>
          <li>Provide updates about your connections and projects</li>
        </ul>

        <h3>Platform Improvement</h3>
        <ul>
          <li>Analyze usage patterns to improve features</li>
          <li>Develop new services and functionality</li>
          <li>Conduct research and analytics</li>
        </ul>

        <h3>Marketing (With Your Consent)</h3>
        <ul>
          <li>Send promotional emails about new features</li>
          <li>Share industry insights and content</li>
          <li>Notify you about special offers</li>
        </ul>
      </>
    ),
  },
  {
    id: 'information-sharing',
    title: 'Information Sharing',
    content: (
      <>
        <p>
          We do not sell your personal information to third parties. We may
          share your information in the following circumstances:
        </p>

        <h3>With Other Users</h3>
        <p>
          When you choose to connect with a supplier or designer, we share
          relevant information to facilitate the connection. This may include
          your profile information, design specifications, and contact details.
        </p>

        <h3>Service Providers</h3>
        <p>
          We work with trusted third-party service providers who assist in
          operating our platform, including:
        </p>
        <ul>
          <li>Cloud hosting providers</li>
          <li>Payment processors</li>
          <li>Analytics services</li>
          <li>Customer support tools</li>
        </ul>

        <h3>Legal Requirements</h3>
        <p>
          We may disclose your information if required by law, court order, or
          government request, or to protect our rights, property, or safety.
        </p>

        <h3>Business Transfers</h3>
        <p>
          In the event of a merger, acquisition, or sale of assets, your
          information may be transferred as part of that transaction.
        </p>
      </>
    ),
  },
  {
    id: 'data-security',
    title: 'Data Security',
    content: (
      <>
        <p>
          We take the security of your data seriously and implement
          appropriate technical and organizational measures to protect it.
        </p>

        <h3>Encryption</h3>
        <p>
          All data transmitted between your device and our servers is encrypted
          using TLS (Transport Layer Security). Sensitive data at rest is
          encrypted using industry-standard encryption algorithms.
        </p>

        <h3>Access Controls</h3>
        <p>
          Access to personal data is restricted to authorized employees and
          contractors who need it to perform their duties. All access is logged
          and monitored.
        </p>

        <h3>Regular Audits</h3>
        <p>
          We conduct regular security assessments and audits to identify and
          address potential vulnerabilities in our systems.
        </p>

        <h3>Incident Response</h3>
        <p>
          We maintain an incident response plan to quickly address any security
          breaches. In the event of a breach affecting your personal data, we
          will notify you in accordance with applicable laws.
        </p>
      </>
    ),
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    content: (
      <>
        <p>
          Depending on your location, you may have certain rights regarding
          your personal information:
        </p>

        <h3>Right to Access</h3>
        <p>
          You can request a copy of the personal data we hold about you.
        </p>

        <h3>Right to Correction</h3>
        <p>
          You can request that we correct any inaccurate or incomplete personal
          data.
        </p>

        <h3>Right to Deletion</h3>
        <p>
          You can request that we delete your personal data, subject to certain
          legal obligations we may have to retain it.
        </p>

        <h3>Right to Data Portability</h3>
        <p>
          You can request to receive your data in a commonly used,
          machine-readable format.
        </p>

        <h3>Right to Opt-Out</h3>
        <p>
          You can opt out of marketing communications at any time by clicking
          the unsubscribe link in our emails or updating your preferences in
          your account settings.
        </p>

        <h3>GDPR and CCPA Compliance</h3>
        <p>
          If you are located in the European Economic Area or California, you
          have additional rights under the GDPR or CCPA respectively. Please
          contact us to exercise these rights.
        </p>
      </>
    ),
  },
  {
    id: 'cookies-tracking',
    title: 'Cookies & Tracking',
    content: (
      <>
        <p>
          We use cookies and similar tracking technologies to collect and store
          information about your preferences and activity on our platform.
        </p>

        <h3>Essential Cookies</h3>
        <p>
          These cookies are necessary for the platform to function properly.
          They enable core functionality such as security, authentication, and
          session management.
        </p>

        <h3>Analytics Cookies</h3>
        <p>
          These cookies help us understand how visitors interact with our
          platform by collecting and reporting information anonymously.
        </p>

        <h3>Managing Cookies</h3>
        <p>
          Most web browsers allow you to control cookies through their settings.
          You can set your browser to refuse cookies or alert you when cookies
          are being sent. However, some features of our platform may not
          function properly without cookies.
        </p>
      </>
    ),
  },
  {
    id: 'third-party-services',
    title: 'Third-Party Services',
    content: (
      <>
        <p>
          Our platform may integrate with or link to third-party services. These
          services have their own privacy policies, and we encourage you to
          review them.
        </p>

        <h3>Payment Processors</h3>
        <p>
          We use secure payment processors to handle subscription payments. Your
          payment information is processed directly by these providers and is
          not stored on our servers.
        </p>

        <h3>Analytics Providers</h3>
        <p>
          We use analytics services to help us understand platform usage and
          improve our services. These services may collect information about
          your use of our platform.
        </p>

        <h3>Cloud Hosting</h3>
        <p>
          Our platform is hosted on secure cloud infrastructure. Your data is
          stored in compliance with industry security standards.
        </p>
      </>
    ),
  },
  {
    id: 'childrens-privacy',
    title: "Children's Privacy",
    content: (
      <>
        <p>
          Our services are not intended for individuals under the age of 16. We
          do not knowingly collect personal information from children under 16.
        </p>
        <p>
          If we become aware that we have collected personal information from a
          child under 16, we will take steps to delete that information as soon
          as possible.
        </p>
        <p>
          If you are a parent or guardian and believe that your child has
          provided us with personal information, please contact us so we can
          take appropriate action.
        </p>
      </>
    ),
  },
  {
    id: 'changes-to-policy',
    title: 'Changes to This Policy',
    content: (
      <>
        <p>
          We may update this Privacy Policy from time to time to reflect changes
          in our practices or for legal, operational, or regulatory reasons.
        </p>
        <p>
          When we make material changes, we will notify you by email or by
          posting a prominent notice on our platform prior to the change
          becoming effective.
        </p>
        <p>
          We encourage you to review this Privacy Policy periodically to stay
          informed about how we are protecting your information. The
          &quot;Last Updated&quot; date at the top of this policy indicates when
          it was last revised.
        </p>
      </>
    ),
  },
  {
    id: 'contact-us',
    title: 'Contact Us',
    content: (
      <>
        <p>
          If you have any questions, concerns, or requests regarding this
          Privacy Policy or our data practices, please contact us:
        </p>

        <h3>Email</h3>
        <p>
          <a
            href="mailto:privacy@agilesourcing.io"
            className="text-agile-teal hover:underline"
          >
            privacy@agilesourcing.io
          </a>
        </p>

        <h3>Mailing Address</h3>
        <p>
          AgileSourcing Inc.
          <br />
          100 King Street West
          <br />
          Suite 5700
          <br />
          Toronto, ON M5X 1C7
          <br />
          Canada
        </p>

        <h3>Data Protection Officer</h3>
        <p>
          For matters related to data protection and privacy rights, you may
          also contact our Data Protection Officer at{' '}
          <a
            href="mailto:dpo@agilesourcing.io"
            className="text-agile-teal hover:underline"
          >
            dpo@agilesourcing.io
          </a>
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <LandingNavbar />
      <LegalPageLayout
        title="Privacy Policy"
        lastUpdated="January 15, 2026"
        description="How we collect, use, and protect your personal information."
        sections={sections}
      />
      <LandingFooter />
    </main>
  );
}
