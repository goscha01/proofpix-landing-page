import { LegalPage, Section, P, UL, Highlight } from "./LegalPage";

function DataDeletion() {
  return (
    <LegalPage
      title="Data Deletion Policy"
      subtitle="How to request deletion of your account and data"
      lastUpdated="April 3, 2026"
    >
      <Section title="Data Storage and Deletion">
        <P>ProofPix does not store user photos on its servers. Photos are stored locally on your device or in your connected cloud storage accounts (Google Drive, Dropbox, or iCloud).</P>
        <P>To delete your data:</P>
        <UL items={[
          "Remove the app from your device to delete local data",
          "Delete files directly from your connected cloud storage provider",
          "Disconnect cloud integrations within the app if applicable",
        ]} />
        <P>If you have contacted us via forms, you may request deletion of that data by contacting <a href="mailto:info@geos-ai.com" style={{ color: "#2563EB" }}>info@geos-ai.com</a>.</P>
      </Section>

      <Section title="How to Request Account Deletion">
        <P>If you would like to delete your ProofPix account and all associated data, you can do so in one of the following ways:</P>
        <UL items={[
          <><strong>In-app:</strong> Go to Settings &gt; Account &gt; Delete Account. This will permanently delete your account and all associated data.</>,
          <><strong>By email:</strong> Send a request to <a href="mailto:info@geos-ai.com" style={{ color: "#2563EB" }}>info@geos-ai.com</a> with the subject line "Data Deletion Request" and include the email address associated with your account.</>,
        ]} />
      </Section>

      <Section title="What Data Is Deleted">
        <P>When you request account deletion, we permanently delete the following:</P>
        <UL items={[
          "Your account profile and credentials",
          "All before/after photo pairs and projects",
          "Custom layouts, labels, watermark settings, and branding",
          "Team membership and shared access data",
          "Usage history and analytics linked to your account",
          "Cloud storage connections (Google Drive, Dropbox tokens)",
        ]} />
        <Highlight>Deletion is permanent and cannot be undone. Export any data you wish to keep before requesting deletion.</Highlight>
      </Section>

      <Section title="Data Retention After Deletion">
        <P>Once a deletion request is processed, your data is permanently removed from our servers within 30 days. The following may be retained:</P>
        <UL items={[
          <><strong>Anonymized analytics:</strong> Aggregated usage statistics that cannot be linked back to your account.</>,
          <><strong>Legal obligations:</strong> Billing records or fraud prevention data retained for the minimum period required by law.</>,
          <><strong>Backup systems:</strong> Residual copies in encrypted backups are purged within 90 days.</>,
        ]} />
      </Section>

      <Section title="Third-Party Services">
        <P>If you connected Google Drive or Dropbox to ProofPix, deleting your account removes the connection between your account and those services. Photos already exported to your cloud storage are not affected and must be managed directly through those platforms.</P>
        <P>We recommend revoking app permissions after account deletion:</P>
        <UL items={[
          <><a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" style={{ color: "#2563EB" }}>Google Account Permissions</a></>,
          <><a href="https://www.dropbox.com/account/connected_apps" target="_blank" rel="noopener noreferrer" style={{ color: "#2563EB" }}>Dropbox Connected Apps</a></>,
        ]} />
      </Section>

      <Section title="Processing Time">
        <UL items={[
          <><strong>In-app requests:</strong> Processed immediately.</>,
          <><strong>Email requests:</strong> Processed within 7 business days.</>,
        ]} />
        <P>You will receive a confirmation email once the deletion is complete.</P>
      </Section>

      <Section title="Contact">
        <P>
          If you have questions about data deletion, contact us:<br />
          <strong>Geos LLC</strong><br />
          Email: <a href="mailto:info@geos-ai.com" style={{ color: "#2563EB" }}>info@geos-ai.com</a><br />
          Phone: (248) 346-2681<br />
          Address: 5631 Raven Ct, Bloomfield Hills, MI 48301
        </P>
      </Section>
    </LegalPage>
  );
}

export default DataDeletion;
