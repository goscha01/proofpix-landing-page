import { LegalPage, Section, P, UL, Highlight } from "./LegalPage";

function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      subtitle="How we collect, use, and protect your information"
      lastUpdated="April 2, 2026"
    >
      <Section title="Introduction">
        <P>Geos LLC ("we," "our," or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use ProofPix and related services.</P>
      </Section>

      <Section title="Information You Provide">
        <UL items={[
          <><strong>Account Information:</strong> Name, email address, profile information</>,
          <><strong>Content:</strong> Photos, before/after image pairs, projects, and layouts you create</>,
          <><strong>Preferences:</strong> Custom labels, watermark settings, layout configurations</>,
          <><strong>Team Data:</strong> Team membership and shared access information</>,
        ]} />
      </Section>

      <Section title="Information We Collect Automatically">
        <UL items={[
          <><strong>Usage Data:</strong> How you interact with the app, features used, session duration</>,
          <><strong>Device Information:</strong> Device type, operating system, unique device identifiers</>,
          <><strong>Location Data:</strong> Approximate location based on IP address</>,
          <><strong>Log Data:</strong> IP addresses, access times, app version, crash reports</>,
        ]} />
      </Section>

      <Section title="How We Use Your Information">
        <UL items={[
          "Provide and maintain the ProofPix service",
          "Process and store your before/after photos and projects",
          "Sync data across your devices and team members",
          "Send operational notifications (account updates, feature changes)",
          "Improve app performance and fix bugs",
          "Analyze usage patterns to improve features",
        ]} />
      </Section>

      <Section title="Cloud Storage Integrations">
        <P>ProofPix allows you to connect Google Drive and Dropbox to export your photos. When you connect these services:</P>
        <UL items={[
          "We only access the specific folders and permissions you authorize",
          "Photos are exported at your request — we do not continuously sync",
          "You can disconnect these services at any time in Settings",
          "We do not read or modify existing files in your cloud storage",
        ]} />
      </Section>

      <Section title="Data Security">
        <P>We implement appropriate security measures to protect your information, including encryption of sensitive data, secure server infrastructure, regular security assessments, and access controls.</P>
        <Highlight>Your photos are stored securely and are never shared with third parties for advertising or marketing purposes.</Highlight>
      </Section>

      <Section title="Your Rights">
        <P>You have the right to:</P>
        <UL items={[
          <><strong>Access:</strong> Request a copy of your personal information</>,
          <><strong>Update:</strong> Modify your account information and preferences</>,
          <><strong>Delete:</strong> Request deletion of your account and data (see our <a href="/data-deletion" style={{ color: "#2563EB" }}>Data Deletion Policy</a>)</>,
          <><strong>Export:</strong> Download your photos and project data</>,
          <><strong>Opt-out:</strong> Unsubscribe from non-essential communications</>,
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
