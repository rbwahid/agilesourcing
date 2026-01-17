import { LandingNavbar, LandingFooter, LegalPageLayout } from '@/components/landing';

const sections = [
  {
    id: 'agreement-to-terms',
    title: 'Agreement to Terms',
    content: (
      <>
        <p>
          Welcome to AgileSourcing. These Terms of Service (&quot;Terms&quot;)
          govern your access to and use of our platform, website, and services
          (collectively, the &quot;Service&quot;).
        </p>
        <p>
          By accessing or using our Service, you agree to be bound by these
          Terms. If you disagree with any part of these Terms, you may not
          access the Service.
        </p>

        <h3>Eligibility</h3>
        <ul>
          <li>You must be at least 16 years old to use this Service</li>
          <li>
            If you are using the Service on behalf of a business or
            organization, you represent that you have the authority to bind
            that entity to these Terms
          </li>
          <li>
            You must provide accurate and complete information when creating an
            account
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'account-registration',
    title: 'Account Registration',
    content: (
      <>
        <p>
          To access certain features of our Service, you must register for an
          account. When you create an account, you agree to the following:
        </p>

        <h3>Accurate Information</h3>
        <p>
          You agree to provide accurate, current, and complete information
          during registration and to update this information to keep it
          accurate and current.
        </p>

        <h3>Account Security</h3>
        <ul>
          <li>
            You are responsible for maintaining the confidentiality of your
            account credentials
          </li>
          <li>
            You agree to notify us immediately of any unauthorized access to or
            use of your account
          </li>
          <li>
            You are responsible for all activities that occur under your account
          </li>
        </ul>

        <h3>One Account Per Person</h3>
        <p>
          Each individual may only maintain one account. Creating multiple
          accounts may result in termination of all accounts.
        </p>

        <h3>Account Termination</h3>
        <p>
          We reserve the right to suspend or terminate your account at any time
          for any reason, including violation of these Terms.
        </p>
      </>
    ),
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable Use',
    content: (
      <>
        <p>
          You agree to use our Service only for lawful purposes and in
          accordance with these Terms. You agree not to:
        </p>

        <h3>Legal Compliance</h3>
        <ul>
          <li>
            Violate any applicable local, national, or international law or
            regulation
          </li>
          <li>
            Engage in any activity that is fraudulent, false, or misleading
          </li>
        </ul>

        <h3>Intellectual Property</h3>
        <ul>
          <li>
            Infringe upon the intellectual property rights of others
          </li>
          <li>
            Upload content that you do not have the right to share
          </li>
        </ul>

        <h3>Harmful Content</h3>
        <ul>
          <li>
            Upload or transmit viruses, malware, or other malicious code
          </li>
          <li>
            Post content that is defamatory, obscene, or offensive
          </li>
          <li>
            Harass, abuse, or harm other users
          </li>
        </ul>

        <h3>Platform Integrity</h3>
        <ul>
          <li>
            Attempt to gain unauthorized access to our systems or other users&apos;
            accounts
          </li>
          <li>
            Interfere with or disrupt the Service or servers
          </li>
          <li>
            Use automated means to access the Service without our permission
          </li>
          <li>
            Attempt to circumvent any content filtering or security measures
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    content: (
      <>
        <h3>Our Intellectual Property</h3>
        <p>
          The Service, including its original content, features, and
          functionality, is owned by AgileSourcing and is protected by
          international copyright, trademark, patent, trade secret, and other
          intellectual property laws.
        </p>
        <p>
          Our trademarks, logos, and service marks may not be used in connection
          with any product or service without our prior written consent.
        </p>

        <h3>License to Use</h3>
        <p>
          Subject to your compliance with these Terms, we grant you a limited,
          non-exclusive, non-transferable, revocable license to access and use
          the Service for your personal or internal business purposes.
        </p>
      </>
    ),
  },
  {
    id: 'user-content',
    title: 'User Content',
    content: (
      <>
        <h3>Ownership</h3>
        <p>
          You retain ownership of all content you upload, post, or submit to the
          Service, including designs, images, and other materials (&quot;User
          Content&quot;).
        </p>

        <h3>License Grant</h3>
        <p>
          By uploading User Content, you grant AgileSourcing a worldwide,
          non-exclusive, royalty-free license to use, reproduce, process,
          display, and distribute your User Content solely for the purpose of
          providing the Service. This includes:
        </p>
        <ul>
          <li>Processing designs through our AI analysis system</li>
          <li>Displaying your content to potential suppliers or designers</li>
          <li>Creating thumbnails and previews of your content</li>
        </ul>

        <h3>Your Responsibilities</h3>
        <ul>
          <li>
            You are solely responsible for your User Content and the
            consequences of posting it
          </li>
          <li>
            You represent that you have all necessary rights to upload and share
            your User Content
          </li>
          <li>
            Your User Content must not infringe on the intellectual property
            rights of others
          </li>
        </ul>

        <h3>Content Removal</h3>
        <p>
          We reserve the right to remove any User Content that violates these
          Terms or that we find objectionable, without prior notice.
        </p>
      </>
    ),
  },
  {
    id: 'supplier-interactions',
    title: 'Supplier Interactions',
    content: (
      <>
        <h3>Platform Role</h3>
        <p>
          AgileSourcing provides a platform to facilitate connections between
          fashion designers and manufacturing suppliers. We are not a party to
          any agreements you make with other users.
        </p>

        <h3>Independent Agreements</h3>
        <p>
          Any contracts, agreements, or arrangements you enter into with
          suppliers or designers are solely between you and the other party.
          AgileSourcing is not responsible for the performance or conduct of any
          user.
        </p>

        <h3>Verification Limitations</h3>
        <p>
          While we make efforts to verify supplier credentials, we cannot
          guarantee the accuracy of any information provided by users. You are
          responsible for conducting your own due diligence before entering into
          any business relationship.
        </p>

        <h3>Dispute Resolution</h3>
        <p>
          In the event of a dispute between users, you agree to first attempt to
          resolve the dispute directly with the other party. AgileSourcing may,
          but is not obligated to, assist in mediating disputes.
        </p>
      </>
    ),
  },
  {
    id: 'payment-terms',
    title: 'Payment Terms',
    content: (
      <>
        <h3>Subscription Billing</h3>
        <p>
          Certain features of our Service require a paid subscription. By
          subscribing, you agree to pay the applicable fees and any taxes.
          Subscriptions automatically renew unless cancelled before the renewal
          date.
        </p>

        <h3>Refund Policy</h3>
        <p>
          Subscription fees are generally non-refundable. However, we may
          provide refunds or credits at our discretion in certain circumstances.
          Please contact our support team for refund requests.
        </p>

        <h3>Price Changes</h3>
        <p>
          We reserve the right to change our pricing at any time. We will
          provide reasonable notice of any price changes before they take
          effect. Continued use of the Service after a price change constitutes
          acceptance of the new pricing.
        </p>

        <h3>Failed Payments</h3>
        <p>
          If a payment fails, we may suspend access to premium features until
          payment is received. We will make reasonable attempts to notify you of
          any payment issues.
        </p>
      </>
    ),
  },
  {
    id: 'disclaimers',
    title: 'Disclaimers',
    content: (
      <>
        <h3>Service Provided &quot;As Is&quot;</h3>
        <p>
          THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS
          AVAILABLE&quot; BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER
          EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR
          NON-INFRINGEMENT.
        </p>

        <h3>No Guarantee of Results</h3>
        <p>
          We do not guarantee any specific results from using our Service,
          including successful matches with suppliers, production outcomes, or
          business success. The AI analysis and recommendations are provided for
          informational purposes only.
        </p>

        <h3>Supplier Verification</h3>
        <p>
          While we strive to verify supplier credentials, we cannot guarantee
          the accuracy of any information or the quality of any supplier&apos;s
          products or services. Users are responsible for their own due
          diligence.
        </p>
      </>
    ),
  },
  {
    id: 'limitation-of-liability',
    title: 'Limitation of Liability',
    content: (
      <>
        <h3>Cap on Damages</h3>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL
          AGILESOURCING, ITS AFFILIATES, DIRECTORS, EMPLOYEES, OR AGENTS BE
          LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
          PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA,
          USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
        </p>
        <p>
          Our total liability to you for any claims arising out of or relating
          to these Terms or the Service shall not exceed the amount you have
          paid to us in the twelve (12) months preceding the claim.
        </p>

        <h3>Exclusions</h3>
        <p>
          The limitations above do not apply to liability for death or personal
          injury caused by negligence, fraud or fraudulent misrepresentation, or
          any other liability that cannot be excluded under applicable law.
        </p>
      </>
    ),
  },
  {
    id: 'indemnification',
    title: 'Indemnification',
    content: (
      <>
        <p>
          You agree to defend, indemnify, and hold harmless AgileSourcing, its
          affiliates, directors, officers, employees, and agents from and
          against any claims, damages, obligations, losses, liabilities, costs,
          or debt, and expenses arising from:
        </p>

        <h3>Your Actions</h3>
        <ul>
          <li>Your use of and access to the Service</li>
          <li>Your violation of these Terms</li>
          <li>
            Your violation of any third party right, including intellectual
            property, privacy, or other rights
          </li>
        </ul>

        <h3>Your Content</h3>
        <ul>
          <li>Any User Content you upload, post, or submit</li>
          <li>
            Claims that your User Content infringes the rights of any third
            party
          </li>
        </ul>

        <h3>Third-Party Claims</h3>
        <ul>
          <li>
            Any claims or disputes arising from your interactions with other
            users
          </li>
          <li>
            Any claims from suppliers, manufacturers, or other business partners
            you engage through the Service
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'termination',
    title: 'Termination',
    content: (
      <>
        <h3>Your Right to Cancel</h3>
        <p>
          You may terminate your account at any time by contacting us or using
          the account settings in your dashboard. Upon termination, your right
          to use the Service will immediately cease.
        </p>

        <h3>Our Right to Terminate</h3>
        <p>
          We may terminate or suspend your account and access to the Service
          immediately, without prior notice or liability, for any reason,
          including if you breach these Terms.
        </p>

        <h3>Effect of Termination</h3>
        <ul>
          <li>
            Your access to the Service and any data or content will be removed
          </li>
          <li>
            Any outstanding payments owed to us will become immediately due
          </li>
          <li>
            We may retain certain information as required by law or for
            legitimate business purposes
          </li>
        </ul>

        <h3>Survival</h3>
        <p>
          The following sections shall survive termination: Intellectual
          Property, Disclaimers, Limitation of Liability, Indemnification, and
          Governing Law.
        </p>
      </>
    ),
  },
  {
    id: 'governing-law',
    title: 'Governing Law',
    content: (
      <>
        <h3>Applicable Law</h3>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of the Province of Ontario and the federal laws of Canada
          applicable therein, without regard to its conflict of law provisions.
        </p>

        <h3>Jurisdiction</h3>
        <p>
          Any legal action or proceeding arising out of or relating to these
          Terms or the Service shall be brought exclusively in the courts
          located in Toronto, Ontario, Canada, and you consent to the personal
          jurisdiction of such courts.
        </p>

        <h3>Dispute Resolution</h3>
        <p>
          Before filing any legal action, you agree to attempt to resolve any
          dispute informally by contacting us. If we are unable to resolve the
          dispute informally within thirty (30) days, either party may proceed
          with formal legal proceedings.
        </p>
      </>
    ),
  },
  {
    id: 'changes-to-terms',
    title: 'Changes to Terms',
    content: (
      <>
        <h3>Right to Modify</h3>
        <p>
          We reserve the right to modify or replace these Terms at any time at
          our sole discretion. We will make reasonable efforts to notify you of
          any material changes.
        </p>

        <h3>Notice of Changes</h3>
        <p>
          When we make material changes, we will notify you by email or by
          posting a prominent notice on our Service at least thirty (30) days
          before the changes take effect.
        </p>

        <h3>Continued Use</h3>
        <p>
          Your continued use of the Service after any changes to these Terms
          constitutes your acceptance of the new Terms. If you do not agree to
          the new Terms, you must stop using the Service.
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
          If you have any questions about these Terms of Service, please contact
          us:
        </p>

        <h3>Email</h3>
        <p>
          <a
            href="mailto:legal@agilesourcing.io"
            className="text-agile-teal hover:underline"
          >
            legal@agilesourcing.io
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

        <h3>General Inquiries</h3>
        <p>
          For general questions or support, please visit our{' '}
          <a href="/contact" className="text-agile-teal hover:underline">
            Contact page
          </a>{' '}
          or email{' '}
          <a
            href="mailto:support@agilesourcing.io"
            className="text-agile-teal hover:underline"
          >
            support@agilesourcing.io
          </a>
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <LandingNavbar />
      <LegalPageLayout
        title="Terms of Service"
        lastUpdated="January 15, 2026"
        description="The terms and conditions governing your use of our platform."
        sections={sections}
      />
      <LandingFooter />
    </main>
  );
}
