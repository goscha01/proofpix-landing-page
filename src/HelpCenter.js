import { LegalPage, Section, P, H3, UL, OL, Highlight } from "./LegalPage";

export default function HelpCenter() {
  return (
    <LegalPage
      title="ProofPix Help Center"
      subtitle="Guides, troubleshooting, and answers for using ProofPix."
      lastUpdated="June 3, 2026"
    >
      <Section title="Welcome to ProofPix">
        <P>ProofPix is the field documentation platform for service businesses. Capture, organize, document, and share every job — with branded reports, cloud sync, and workflows built for field teams.</P>
        <P>Whether you&apos;re running a cleaning crew, a restoration team, a roofing operation, a landscaping route, a property portfolio, or any other field service, ProofPix turns job photos into professional, client-ready deliverables.</P>
        <Highlight>
          Looking for something specific? Jump to{" "}
          <a href="#getting-started" style={{ color: "#0B8321", textDecoration: "underline" }}>Getting Started</a>,{" "}
          <a href="#guides" style={{ color: "#0B8321", textDecoration: "underline" }}>Guides</a>,{" "}
          <a href="#plans" style={{ color: "#0B8321", textDecoration: "underline" }}>Plans</a>,{" "}
          <a href="#troubleshooting" style={{ color: "#0B8321", textDecoration: "underline" }}>Troubleshooting</a>,{" "}
          <a href="#faq" style={{ color: "#0B8321", textDecoration: "underline" }}>FAQ</a>, or{" "}
          <a href="#contact" style={{ color: "#0B8321", textDecoration: "underline" }}>Contact Support</a>.
        </Highlight>
      </Section>

      <Section title="Getting Started">
        <span id="getting-started" />
        <H3>Create Your First Project</H3>
        <OL items={[
          "Open ProofPix.",
          "Tap New Project.",
          "Enter a project name.",
          "Create sections such as Living Room, Kitchen, Exterior, Bedroom, Location 1, or your own custom sections.",
        ]} />
        <P>Each section stores its own photo timeline.</P>

        <H3>Capture Photos</H3>
        <P>Tap a section and take a photo. The first photo becomes the Before photo.</P>
        <P>When you take another photo:</P>
        <UL items={[
          "The newest photo becomes the After photo.",
          "The previous After photo automatically becomes a Progress photo.",
        ]} />
        <P>This creates a visual timeline without requiring manual organization.</P>

        <H3>Compare Results</H3>
        <P>Open any photo set and choose:</P>
        <UL items={[
          <><strong>Overlay View</strong> — place the before and after photos on top of each other. Perfect for matching camera angles and spotting changes.</>,
          <><strong>Split View</strong> — compare before and after using a movable divider. Perfect for presentations and customer proof.</>,
          <><strong>Side-by-Side View</strong> — display both photos next to each other. Perfect for detailed inspections.</>,
        ]} />

        <H3>Share Your Work</H3>
        <P>Depending on your subscription plan, you can share:</P>
        <UL items={[
          "Individual photos",
          "Before & After comparisons",
          "Combined images",
          "Project reports",
        ]} />
      </Section>

      <Section title="Guides">
        <span id="guides" />

        <H3>Furniture Cleaning</H3>
        <OL items={[
          "Take a Before photo.",
          "Complete the cleaning.",
          "Take an After photo.",
          "Share the comparison with your customer.",
        ]} />
        <P><strong>Result:</strong> professional proof of completed work.</P>

        <H3>House Cleaning</H3>
        <P>Create sections such as Kitchen, Bathroom, Bedroom, and Living Room. Take before photos first. As you work, continue taking photos. ProofPix automatically builds your progress timeline.</P>

        <H3>Remodeling Projects</H3>
        <P>Create sections for Kitchen, Exterior, Flooring, and Bathrooms. Document progress over multiple days or weeks.</P>
        <UL items={[
          "The first photo becomes Before.",
          "The latest photo becomes After.",
          "Everything in between becomes Progress documentation.",
        ]} />

        <H3>Restoration Projects</H3>
        <P>Perfect for water damage, fire restoration, and mold remediation. Document every stage of the project for customers, insurance companies, and internal records.</P>

        <H3>Landscaping</H3>
        <P>Capture initial condition, mid-project progress, and finished result. Generate professional reports for customers.</P>
      </Section>

      <Section title="Subscription Plans">
        <span id="plans" />

        <H3>Starter</H3>
        <UL items={[
          "1 project",
          "Up to 100 photos",
          "Before / Progress / After workflow",
          "Overlay view",
          "Split view",
          "Combined image sharing",
          "Watermarked exports",
        ]} />

        <H3>Pro</H3>
        <P>Everything in Starter, plus:</P>
        <UL items={[
          "Unlimited projects",
          "Unlimited photos",
          "Remove watermark",
          "Reports",
          "Voice notes",
          "Markup tools",
          "Cloud backup",
          "ZIP exports",
        ]} />

        <H3>Business</H3>
        <P>Everything in Pro, plus:</P>
        <UL items={[
          "Team members",
          "Company branding",
          "Shared projects",
          "Metadata overlays",
          "Business reporting",
        ]} />

        <P><a href="/#pricing" style={{ color: "#0B8321", textDecoration: "underline" }}>See full pricing & compare features →</a></P>
      </Section>

      <Section title="Troubleshooting">
        <span id="troubleshooting" />

        <H3>My Before Photo Changed</H3>
        <P>ProofPix always uses the first photo in a section as the Before photo. If the wrong photo was selected, open the gallery and choose the correct image.</P>

        <H3>Why Did My After Photo Change?</H3>
        <P>The newest photo automatically becomes the After photo. The previous After photo becomes a Progress photo. This behavior helps build a complete project timeline.</P>

        <H3>My Comparison Doesn&apos;t Match</H3>
        <P>Use Overlay View while taking follow-up photos. Align your camera with the original image for the best comparison results.</P>

        <H3>Why Do My Exports Have a Watermark?</H3>
        <P>Watermarked exports are included with the Starter plan. Upgrade to Pro to remove the ProofPix watermark.</P>

        <H3>My Photos Are Missing</H3>
        <P>Verify that:</P>
        <UL items={[
          "You are viewing the correct project.",
          "You selected the correct section.",
          "The gallery filter is set to All Photos.",
        ]} />
      </Section>

      <Section title="Frequently Asked Questions">
        <span id="faq" />

        <H3>What industries use ProofPix?</H3>
        <P>ProofPix supports field documentation across 15+ service industries, including:</P>
        <UL items={[
          "Cleaning (residential, commercial, carpet, furniture)",
          "Restoration (water damage, fire, mold)",
          "Roofing",
          "Landscaping & Pressure Washing",
          "Flooring",
          "Painting",
          "Plumbing",
          "Electrical",
          "HVAC",
          "Auto Detailing",
          "Property Management",
          "Handyman",
          "Pest Control",
          "Beauty / Med Spa",
          "Junk Removal",
          "General Contractors",
        ]} />

        <H3>Do I need internet access?</H3>
        <P>No. Photos can be captured while offline and synchronized later.</P>

        <H3>Can I add progress photos?</H3>
        <P>Yes. Every new photo automatically becomes the latest After photo. Previous After photos become Progress photos.</P>

        <H3>Can I share before-and-after images?</H3>
        <P>Yes. ProofPix can generate comparison images that are easy to send to customers.</P>

        <H3>Can I add my company logo?</H3>
        <P>Business plans include company branding features.</P>

        <H3>Can I export reports?</H3>
        <P>Report exports are available on paid plans.</P>

        <H3>Can my team use the same project?</H3>
        <P>Yes. Business plans support team collaboration and shared projects.</P>
      </Section>

      <Section title="Contact Support">
        <span id="contact" />
        <P>Need help? We typically respond within one business day.</P>
        <UL items={[
          <><strong>Email:</strong> <a href="mailto:support@proofpix.app" style={{ color: "#0B8321", textDecoration: "underline" }}>support@proofpix.app</a></>,
          <><strong>Website:</strong> <a href="https://www.proofpix.app" style={{ color: "#0B8321", textDecoration: "underline" }}>www.proofpix.app</a></>,
        ]} />
      </Section>
    </LegalPage>
  );
}
