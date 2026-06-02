import React from "react";
import { Check } from "lucide-react";

const TIERS = ["Starter", "Pro", "Business", "Enterprise"];

const CATEGORIES = [
  {
    name: "Capture & Workflow",
    rows: [
      { feature: "Projects", values: ["1", "Unlimited", "Unlimited", "Unlimited"] },
      { feature: "Photos", values: ["100", "Unlimited", "Unlimited", "Unlimited"] },
      { feature: "Before / Progress / After workflow", values: [true, true, true, true] },
      { feature: "Ghost Overlay", values: [true, true, true, true] },
      { feature: "Combined Before & After Images", values: [true, true, true, true] },
    ],
  },
  {
    name: "Comparison Views",
    rows: [
      { feature: "Overlay view", values: [true, true, true, true] },
      { feature: "Split view", values: [true, true, true, true] },
      { feature: "Side-by-Side view", values: [false, true, true, true] },
    ],
  },
  {
    name: "Sharing & Export",
    rows: [
      { feature: "Share photos & comparisons", values: [true, true, true, true] },
      { feature: "Combined image sharing", values: [true, true, true, true] },
      { feature: "ProofPix watermark on exports", values: [true, false, false, false] },
      { feature: "Remove ProofPix watermark", values: [false, true, true, true] },
      { feature: "Custom labels & watermark", values: [false, true, true, true] },
      { feature: "ZIP export", values: [false, true, true, true] },
      { feature: "Advanced export formats", values: [false, true, true, true] },
      { feature: "Company logo branding", values: [false, false, true, true] },
    ],
  },
  {
    name: "Reports & Annotations",
    rows: [
      { feature: "Reports", values: [false, true, true, true] },
      { feature: "Business reports", values: [false, false, true, true] },
      { feature: "Markup & annotations", values: [false, true, true, true] },
      { feature: "Voice notes & transcription", values: [false, true, true, true] },
      { feature: "Metadata overlays", values: [false, false, true, true] },
    ],
  },
  {
    name: "Cloud Sync",
    rows: [
      { feature: "Google Drive sync", values: [false, true, true, true] },
      { feature: "Dropbox sync", values: [false, true, true, true] },
      { feature: "Background uploads", values: [false, true, true, true] },
      { feature: "Multiple cloud connections", values: [false, false, true, true] },
    ],
  },
  {
    name: "Team & Support",
    rows: [
      { feature: "Team members", values: ["—", "—", "Up to 5", "Custom"] },
      { feature: "Shared projects", values: [false, false, true, true] },
      { feature: "Multiple locations & profiles", values: [false, false, false, true] },
      { feature: "Dedicated onboarding", values: [false, false, false, true] },
      { feature: "Priority support", values: [false, false, false, true] },
    ],
  },
];

function Cell({ value }) {
  if (value === true) {
    return <Check className="mx-auto h-5 w-5 text-[#009379]" strokeWidth={2.5} />;
  }
  if (value === false) {
    return <span style={{ color: "#B0B0B0" }}>—</span>;
  }
  return <span style={{ color: "#2D2D2D", fontWeight: 600 }}>{value}</span>;
}

export default function CompareFeatures() {
  return (
    <section id="compare" className="px-4 py-12 lg:py-20 lg:px-[62px]">
      <div
        className="flex flex-col items-center"
        style={{ gap: "12px", marginBottom: "40px" }}
      >
        <h2
          style={{ fontWeight: "600", letterSpacing: "-0.201242px" }}
          className="text-center text-[28px] leading-[36px] tracking-tight text-black lg:text-[44px] lg:leading-[62px]"
        >
          Compare all features
        </h2>
        <p
          className="text-center text-[#2D2D2D] text-[15px] lg:text-[18px]"
          style={{ fontWeight: 300, lineHeight: "1.4", maxWidth: "640px" }}
        >
          Full breakdown of what&apos;s included in every plan.
        </p>
      </div>

      <div className="mx-auto" style={{ maxWidth: 1316 }}>
        <div
          className="overflow-x-auto"
          style={{
            borderRadius: "20px",
            boxShadow: "0px 10px 30px rgba(242, 195, 27, 0.18)",
            background: "#FFFFFF",
          }}
        >
          <table
            className="w-full"
            style={{ borderCollapse: "collapse", minWidth: "640px" }}
          >
            <thead>
              <tr style={{ background: "rgba(242, 195, 27, 0.10)" }}>
                <th
                  style={{
                    padding: "18px 24px",
                    fontWeight: 700,
                    fontSize: "15px",
                    color: "#2D2D2D",
                    textAlign: "left",
                  }}
                >
                  Feature
                </th>
                {TIERS.map((t) => (
                  <th
                    key={t}
                    style={{
                      padding: "18px 12px",
                      fontWeight: 700,
                      fontSize: "15px",
                      color: "#2D2D2D",
                      borderLeft: "1px solid rgba(0,0,0,0.06)",
                      textAlign: "center",
                    }}
                  >
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CATEGORIES.map((cat) => (
                <React.Fragment key={cat.name}>
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: "14px 24px",
                        fontWeight: 700,
                        fontSize: "12px",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "#7A7A7A",
                        background: "#FAFAFA",
                        borderTop: "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      {cat.name}
                    </td>
                  </tr>
                  {cat.rows.map((row) => (
                    <tr key={row.feature}>
                      <td
                        style={{
                          padding: "12px 24px",
                          fontSize: "14px",
                          color: "#2D2D2D",
                          borderTop: "1px solid rgba(0,0,0,0.05)",
                        }}
                      >
                        {row.feature}
                      </td>
                      {row.values.map((v, i) => (
                        <td
                          key={i}
                          style={{
                            padding: "12px 12px",
                            fontSize: "14px",
                            borderLeft: "1px solid rgba(0,0,0,0.06)",
                            borderTop: "1px solid rgba(0,0,0,0.05)",
                            textAlign: "center",
                          }}
                        >
                          <Cell value={v} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
