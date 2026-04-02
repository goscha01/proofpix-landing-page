function LegalPage({ title, subtitle, lastUpdated, children }) {
  return (
    <div style={{ fontFamily: "'Alexandria', sans-serif" }} className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 lg:px-16 lg:py-6" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
        <a href="/" className="flex items-center" style={{ gap: "9px" }}>
          <img src="/logo.png" alt="ProofPix" style={{ height: "40px" }} className="w-auto" />
          <span style={{ fontWeight: "600", fontSize: "22px", letterSpacing: "-0.17px" }} className="text-black">ProofPix</span>
        </a>
        <nav className="hidden sm:flex items-center" style={{ gap: "28px" }}>
          <a href="/privacy" style={{ fontWeight: "400", fontSize: "15px", color: "#555" }} className="hover:text-black transition-colors">Privacy</a>
          <a href="/terms" style={{ fontWeight: "400", fontSize: "15px", color: "#555" }} className="hover:text-black transition-colors">Terms</a>
          <a href="/data-deletion" style={{ fontWeight: "400", fontSize: "15px", color: "#555" }} className="hover:text-black transition-colors">Data Deletion</a>
        </nav>
      </header>

      {/* Content */}
      <main className="mx-auto px-6 py-10 lg:px-16 lg:py-16" style={{ maxWidth: "840px" }}>
        <h1 style={{ fontWeight: "700", fontSize: "32px", lineHeight: "1.3", letterSpacing: "-0.5px" }} className="text-black mb-2 lg:text-[40px]">
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontWeight: "400", fontSize: "16px", lineHeight: "1.6" }} className="text-[#666] mb-2">{subtitle}</p>
        )}
        <p style={{ fontWeight: "300", fontSize: "13px" }} className="text-[#aaa] mb-10">
          Last updated: {lastUpdated}
        </p>

        <div className="flex flex-col" style={{ gap: "36px" }}>
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 lg:px-16" style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        <div className="flex flex-col sm:flex-row justify-between items-center mx-auto" style={{ maxWidth: "840px", gap: "12px" }}>
          <p style={{ fontWeight: "300", fontSize: "14px" }} className="text-[#888]">
            &copy; {new Date().getFullYear()} ProofPix &middot; <a href="https://geos-ai.com/" target="_blank" rel="noopener noreferrer" className="underline">Geos LLC</a>
          </p>
          <nav className="flex items-center" style={{ gap: "24px" }}>
            <a href="/privacy" style={{ fontWeight: "400", fontSize: "13px" }} className="text-[#888] hover:text-black transition-colors">Privacy</a>
            <a href="/terms" style={{ fontWeight: "400", fontSize: "13px" }} className="text-[#888] hover:text-black transition-colors">Terms</a>
            <a href="/data-deletion" style={{ fontWeight: "400", fontSize: "13px" }} className="text-[#888] hover:text-black transition-colors">Data Deletion</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 style={{ fontWeight: "600", fontSize: "20px", lineHeight: "1.4", letterSpacing: "-0.2px" }} className="text-black mb-3">{title}</h2>
      {children}
    </section>
  );
}

function P({ children }) {
  return <p style={{ fontWeight: "400", fontSize: "15px", lineHeight: "1.75" }} className="text-[#444] mb-3">{children}</p>;
}

function UL({ items }) {
  return (
    <ul className="flex flex-col mb-3" style={{ gap: "6px", paddingLeft: "20px", listStyleType: "disc" }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontWeight: "400", fontSize: "15px", lineHeight: "1.75" }} className="text-[#444]">{item}</li>
      ))}
    </ul>
  );
}

function Highlight({ children }) {
  return (
    <div className="mb-3" style={{ background: "rgba(242,195,27,0.08)", borderLeft: "3px solid #F2C31B", padding: "14px 18px", borderRadius: "0 10px 10px 0" }}>
      <p style={{ fontWeight: "500", fontSize: "15px", lineHeight: "1.65", marginBottom: 0 }} className="text-[#333]">{children}</p>
    </div>
  );
}

export { LegalPage, Section, P, UL, Highlight };
