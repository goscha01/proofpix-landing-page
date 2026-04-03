import { LegalPage, Section, P, UL, Highlight } from "./LegalPage";

function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      subtitle="How we collect, use, and protect your information"
      lastUpdated="April 3, 2026"
    >
      <Section title="Introduction">
        <P>Geos LLC ("we," "our," or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use ProofPix and related services.</P>
      </Section>

      <Section title="Photos and User Content">
        <P>ProofPix does not collect, store, or process your photos on our servers.</P>
        <P>Photos taken within the app remain on your device and are only uploaded directly to your connected cloud storage providers (such as Google Drive, Dropbox, or iCloud) under your control.</P>
        <Highlight>We do not have access to your photos unless you explicitly choose to share them outside of your cloud storage.</Highlight>
      </Section>

      <Section title="Data We Collect">
        <UL items={[
          <><strong>Device Identifiers:</strong> Including IDFA (Apple Advertising Identifier), when permission is granted</>,
          <><strong>Usage Data:</strong> App interactions such as screen views, feature usage, and events</>,
          <><strong>Advertising Data:</strong> Events like trial start, subscription, and purchase</>,
          <><strong>Diagnostics Data:</strong> Crash logs and performance metrics</>,
        ]} />
      </Section>

      <Section title="Information You Provide">
        <UL items={[
          <><strong>Account Information:</strong> Name, email address, profile information</>,
          <><strong>Preferences:</strong> Custom labels, watermark settings, layout configurations</>,
          <><strong>Team Data:</strong> Team membership and shared access information</>,
        ]} />
      </Section>

      <Section title="Advertising, Analytics, and Tracking">
        <P>We use third-party analytics and advertising services, including Meta (Facebook) and Google, to understand how users interact with the app and to measure the effectiveness of our advertising campaigns.</P>
        <P>With your permission, we may collect and use device identifiers such as the Apple Advertising Identifier (IDFA). This allows us to attribute app installs, trial starts, and subscriptions to advertising campaigns.</P>
        <P>This data may be used by our partners to measure advertising performance across apps and services. We do not use this data to personally identify users.</P>
      </Section>

      <Section title="Tracking Transparency">
        <P>On iOS devices, we request permission to track users using Apple's App Tracking Transparency (ATT) framework. If you grant permission, we may access the advertising identifier (IDFA) for advertising measurement purposes.</P>
        <Highlight>If you decline, tracking will not occur.</Highlight>
      </Section>

      <Section title="Third-Party Services">
        <P>ProofPix integrates with the following third-party services:</P>
        <UL items={[
          <><strong>Meta (Facebook):</strong> Advertising measurement and campaign attribution</>,
          <><strong>Google (Firebase Analytics):</strong> App analytics and event tracking</>,
          <><strong>Google Drive:</strong> Cloud storage for photo exports</>,
          <><strong>Dropbox:</strong> Cloud storage for photo exports</>,
          <><strong>Apple iCloud:</strong> Cloud storage for photo exports</>,
        ]} />
      </Section>

      <Section title="Cloud Storage Integrations">
        <P>ProofPix allows you to connect Google Drive, Dropbox, and iCloud to export your photos. When you connect these services:</P>
        <UL items={[
          "We only access the specific folders and permissions you authorize",
          "Photos are exported at your request — we do not continuously sync",
          "You can disconnect these services at any time in Settings",
          "We do not read or modify existing files in your cloud storage",
        ]} />
      </Section>

      <Section title="How We Use Your Information">
        <UL items={[
          "Provide and maintain the ProofPix service",
          "Measure the effectiveness of advertising campaigns",
          "Improve app performance and fix bugs",
          "Analyze usage patterns to improve features",
          "Send operational notifications (account updates, feature changes)",
        ]} />
      </Section>

      <Section title="Data Security">
        <P>We implement appropriate security measures to protect your information, including encryption of sensitive data, secure infrastructure, regular security assessments, and access controls.</P>
        <Highlight>We do not sell your data. Your photos never leave your device or your connected cloud storage.</Highlight>
      </Section>

      <Section title="Your Rights">
        <P>You have the right to:</P>
        <UL items={[
          <><strong>Access:</strong> Request a copy of your personal information</>,
          <><strong>Update:</strong> Modify your account information and preferences</>,
          <><strong>Delete:</strong> Request deletion of your account and data (see our <a href="/data-deletion" style={{ color: "#2563EB" }}>Data Deletion Policy</a>)</>,
          <><strong>Export:</strong> Download your photos and project data</>,
          <><strong>Opt-out:</strong> Decline tracking via the ATT prompt on iOS, or unsubscribe from non-essential communications</>,
        ]} />
      </Section>

      <Section title="Data Retention">
        <P>We retain your information for as long as your account is active. When you delete your account, your data is permanently removed within 30 days. See our <a href="/data-deletion" style={{ color: "#2563EB" }}>Data Deletion Policy</a> for details.</P>
      </Section>

      <Section title="Children's Privacy">
        <P>ProofPix is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.</P>
      </Section>

      <Section title="Changes to This Policy">
        <P>We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy in the app and updating the "Last Updated" date.</P>
      </Section>

      <Section title="Contact Us">
        <P>
          If you have questions about this Privacy Policy, contact us:<br />
          <strong>Geos LLC</strong><br />
          Email: <a href="mailto:info@geos-ai.com" style={{ color: "#2563EB" }}>info@geos-ai.com</a><br />
          Phone: (248) 346-2681<br />
          Address: 5631 Raven Ct, Bloomfield Hills, MI 48301
        </P>
      </Section>
    </LegalPage>
  );
}

export default Privacy;
