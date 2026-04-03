import { LegalPage, Section, P, UL, Highlight } from "./LegalPage";

function Terms() {
  return (
    <LegalPage
      title="Terms of Service"
      subtitle="Terms governing access to and use of ProofPix"
      lastUpdated="April 3, 2026"
    >
      <Section title="Introduction">
        <P>These Terms of Service ("Terms") govern access to and use of ProofPix, a product operated by Geos LLC ("Geos," "Company," "we," "us," or "our").</P>
        <Highlight>By accessing or using ProofPix, you agree to be bound by these Terms.</Highlight>
      </Section>

      <Section title="1. Eligibility">
        <P>You must be at least 18 years old and legally capable of entering into a binding agreement to use ProofPix. By using the service, you represent that:</P>
        <UL items={[
          "You are acting on behalf of a business or organization, or",
          "You are authorized to bind the business you represent.",
        ]} />
      </Section>

      <Section title="2. Description of Service">
        <P>ProofPix is a before-and-after photo documentation app that enables service professionals to:</P>
        <UL items={[
          "Capture and pair before/after photos with angle matching",
          "Organize photos into projects",
          "Create custom layouts with labels, watermarks, and branding",
          "Share visual proof of work with clients",
          "Collaborate with team members",
          "Export photos to Google Drive and Dropbox",
        ]} />
      </Section>

      <Section title="3. Account Registration">
        <P>To access certain features, you must:</P>
        <UL items={[
          "Create an account",
          "Provide accurate and complete information",
          "Maintain the security of your login credentials",
        ]} />
        <P>You are responsible for all activity under your account.</P>
      </Section>

      <Section title="4. Subscription Plans & Payments">
        <P>ProofPix offers the following plans:</P>
        <UL items={[
          <><strong>Starter ($0/month):</strong> Basic features for individuals</>,
          <><strong>Pro ($8.99/month):</strong> Advanced features for solo professionals</>,
          <><strong>Business ($24.99/month):</strong> Team features for up to 5 members</>,
          <><strong>Enterprise ($69.99/month):</strong> Full features for up to 15 members</>,
        ]} />
        <P>Paid plans are billed monthly. You agree to pay all applicable fees and maintain valid payment information. Subscriptions auto-renew unless cancelled before the next billing cycle.</P>
        <Highlight>Refunds are handled on a case-by-case basis. Contact support for assistance.</Highlight>
      </Section>

      <Section title="5. Your Content">
        <P>You retain full ownership of all photos, images, and content you create or upload through ProofPix. By using the service, you grant us a limited license to store, process, and display your content solely to provide the service to you.</P>
        <P>We do not use your photos for advertising, training, or any purpose other than delivering the ProofPix service.</P>
      </Section>

      <Section title="6. Prohibited Uses">
        <P>You agree not to use ProofPix to:</P>
        <UL items={[
          "Upload illegal, harmful, or abusive content",
          "Engage in fraud or deceptive practices",
          "Attempt to reverse-engineer or tamper with the app",
          "Share account credentials with unauthorized users",
          "Circumvent subscription or feature restrictions",
        ]} />
        <P>We reserve the right to suspend accounts that violate these Terms.</P>
      </Section>

      <Section title="7. Service Availability">
        <P>We strive to keep ProofPix available at all times but do not guarantee uninterrupted service. We may:</P>
        <UL items={[
          "Modify or discontinue features with reasonable notice",
          "Perform maintenance that may temporarily affect availability",
          "Suspend accounts for compliance or security reasons",
        ]} />
      </Section>

      <Section title="8. Limitation of Liability">
        <P>To the maximum extent permitted by law, Geos LLC shall not be liable for:</P>
        <UL items={[
          "Indirect or consequential damages",
          "Lost profits or revenue",
          "Loss of photos or data beyond what is stored in the service",
          "Disputes between you and your clients",
        ]} />
        <Highlight>Total liability shall not exceed the fees paid in the preceding 3 months.</Highlight>
      </Section>

      <Section title="9. Indemnification">
        <P>You agree to indemnify and hold harmless Geos LLC from any claims arising from:</P>
        <UL items={[
          "Your use of ProofPix",
          "Content you upload or share through the service",
          "Your violation of these Terms",
          "Disputes with your clients regarding work documentation",
        ]} />
      </Section>

      <Section title="10. Intellectual Property">
        <P>All ProofPix software, branding, design, and infrastructure remain the property of Geos LLC. You retain ownership of your photos and business data.</P>
      </Section>

      <Section title="11. Termination">
        <P>We may suspend or terminate accounts for violation of these Terms, non-payment, or security concerns. You may cancel your account at any time. Upon termination, your data will be handled according to our <a href="/data-deletion" style={{ color: "#2563EB" }}>Data Deletion Policy</a>.</P>
      </Section>

      <Section title="12. Analytics and Advertising">
        <P>ProofPix uses third-party analytics and advertising services to improve the product and measure the effectiveness of marketing campaigns. Use of these services is governed by our <a href="/privacy" style={{ color: "#2563EB" }}>Privacy Policy</a>.</P>
      </Section>

      <Section title="13. Privacy">
        <P>Use of ProofPix is also governed by our <a href="/privacy" style={{ color: "#2563EB" }}>Privacy Policy</a>.</P>
      </Section>

      <Section title="14. Changes to Terms">
        <P>We may update these Terms from time to time. Continued use of ProofPix constitutes acceptance of updated Terms.</P>
      </Section>

      <Section title="15. Contact Information">
        <P>
          If you have questions about these Terms, contact us:<br />
          <strong>Geos LLC</strong><br />
          Email: <a href="mailto:info@geos-ai.com" style={{ color: "#2563EB" }}>info@geos-ai.com</a><br />
          Website: <a href="https://geos-ai.com" style={{ color: "#2563EB" }}>geos-ai.com</a>
        </P>
      </Section>
    </LegalPage>
  );
}

export default Terms;
