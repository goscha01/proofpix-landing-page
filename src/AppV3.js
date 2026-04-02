import { useState, useEffect, useRef } from "react";
import { AlertCircle, ArrowRight, Check, CheckCircle2, Info, Star } from "lucide-react";

const BEFORE_AFTER_PAIRS = 6;
// Use .jpg for before/after (lighter than PNG) so the page loads faster when hosted
const BEFORE_AFTER_IMGS = [
  { before: "/before1.jpg", after: "/after1.jpg" },
  { before: "/before2.jpg", after: "/after2.jpg" },
  { before: "/before3.jpg", after: "/after3.jpg" },
  { before: "/before4.jpg", after: "/after4.jpg" },
  { before: "/before5.jpg", after: "/after5.jpg" },
  { before: "/before6.jpg", after: "/after6.jpg" },
];

// Hero backgrounds — pre-cropped to exact hero dimensions, cycle every 10s
const HERO_DESKTOP_IMGS = ["/bg1-desktop.jpg", "/bg2-desktop.jpg", "/bg3-desktop.jpg"];
const HERO_MOBILE_IMGS = ["/bg1-mobile.jpg", "/bg2-mobile.jpg", "/bg3-mobile.jpg"];

const KEY_FEATURES_MOBILE = [
  { title: "Bulk Capture", description: "Shoot before/after without mixing" },
  { title: "Ghost Mode", description: "Match angles instantly" },
  { title: "Custom Layouts", description: "Labels, fonts, colors, watermark" },
  { title: "Project Organization", description: "No gallery clutter" },
  { title: "Drive/Dropbox Linking", description: "Use your cloud" },
  { title: "Team Uploads", description: "Simple field workflow" },
];

const KEY_FEATURE_IMAGES = [
  "/appscreenshot.png", // Bulk Capture
  "/ghost.png", // Ghost Mode
  "/custom_layout.png", // Custom Layouts
  "/projects.png", // Project Organization
  "/dropbox.png", // Drive/Dropbox Linking
  "/teams.png", // Team Uploads
];

function App() {
  const [keyFeatureIndex, setKeyFeatureIndex] = useState(0);
  const [beforeAfterIndex, setBeforeAfterIndex] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0);
  // Mobile camera chaos: 12 steps (6 pairs × 2 phases). Even = before, odd = after.
  // After each "after" phase, the corresponding bullet turns green.
  const [mobileStep, setMobileStep] = useState(0);
  const [activeRowLabel, setActiveRowLabel] = useState(null);
  const [activeTierName, setActiveTierName] = useState(null);
  const mobilePairIndex = Math.floor(mobileStep / 2); // which pair (0-5)
  const mobileShowingAfter = mobileStep % 2 === 1; // false = before, true = after
  const mobileGreenCount = Math.floor((mobileStep + 1) / 2); // how many bullets are green (0-6)
  const touchStartX = useRef(0);

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      setKeyFeatureIndex((i) => diff > 0 ? (i + 1) % KEY_FEATURES_MOBILE.length : (i - 1 + KEY_FEATURES_MOBILE.length) % KEY_FEATURES_MOBILE.length);
    }
  };

  useEffect(() => {
    const t = setInterval(() => {
      setBeforeAfterIndex((i) => (i + 1) % BEFORE_AFTER_PAIRS);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  // Mobile camera chaos cycle: 2.5s per phase (before shown, then after shown)
  useEffect(() => {
    const t = setInterval(() => {
      setMobileStep((s) => (s + 1) % (BEFORE_AFTER_PAIRS * 2));
    }, 2500);
    return () => clearInterval(t);
  }, []);

  // Rotate hero background every 10 seconds
  useEffect(() => {
    const t = setInterval(
      () => setHeroIndex((i) => (i + 1) % HERO_DESKTOP_IMGS.length),
      10000
    );
    return () => clearInterval(t);
  }, []);

  // Auto-rotate key features. When user clicks a feature, this effect
  // re-runs and starts a fresh 5s countdown from that selection.
  useEffect(() => {
    const t = setTimeout(() => {
      setKeyFeatureIndex((i) => (i + 1) % KEY_FEATURE_IMAGES.length);
    }, 5000);
    return () => clearTimeout(t);
  }, [keyFeatureIndex]);

  return (
    <div style={{ fontFamily: "'Alexandria', sans-serif" }} className="min-h-screen ">

      {/* Main content */}
      <main className="flex flex-1 flex-col gap-20">
        {/* Hero */}
        <section
          className="flex w-full flex-col min-h-0 h-auto items-center relative"
          style={{
            backgroundColor: "#FFFFFF",
          }}
        >
          {/* Desktop layer 1: Yellow gradient covering entire hero including header */}
          <div
            className="hidden sm:block absolute inset-0"
            style={{ zIndex: 0, pointerEvents: "none", background: "linear-gradient(180deg, rgba(242, 195, 27, 0.4) 0%, rgba(242, 195, 27, 0) 50%)" }}
          />


          <div className="relative z-10 w-full sm:h-full sm:flex sm:flex-col">
          <header className="hidden items-center justify-between w-full max-w-[1260px] mx-auto px-[90px] pt-[50px] pb-6 sm:flex">
            <div className="flex items-center gap-[9.31px]">
              <img src="/logo.png" alt="ProofPix" className="h-[59px] w-auto" />
              <span style={{ fontSize: "37.46px", lineHeight: "46px", fontWeight: "600", letterSpacing: "-0.17px" }} className="font-semibold tracking-tight text-proofpix-black">
                ProofPix
              </span>
            </div>

            <button style={{ fontSize: "18px", lineHeight: "22px", fontWeight: "600", letterSpacing: "-0.17px" }} className="rounded-full bg-black px-[26px] py-[13px] font-semibold text-white transition hover:bg-neutral-900">
              Download App
            </button>
          </header>
          {/* Mobile hero — fits viewport height */}
          <div className="relative w-full sm:hidden" style={{ height: "100dvh", background: "#FFFFFF" }}>
            {/* Yellow gradient — covers top area behind logo */}
            <div
              className="absolute top-0 left-0 w-full pointer-events-none"
              style={{
                height: "25%",
                background: "linear-gradient(180deg, rgba(242, 195, 27, 0.4) 0%, rgba(242, 195, 27, 0) 100%)",
              }}
            />
            {/* Background image — content area, fading to white */}
            <img
              src={HERO_MOBILE_IMGS[heroIndex]}
              alt=""
              className="absolute left-0 w-full object-cover"
              style={{ top: "15%", height: "50%" }}
            />
            {/* Gradient fade from image into white */}
            <div
              className="absolute left-0 w-full pointer-events-none"
              style={{
                top: "15%",
                height: "50%",
                background:
                  "linear-gradient(to bottom, rgb(252 244 215) 0%, rgba(255, 255, 255, 0.75) 25%, rgba(255,255,255,0) 50%, #FFFFFF 90%)",
              }}
            />
            {/* Logo centered at top — add shadow only to the icon so it stays visible over photos */}
            <div className="absolute inset-x-0 flex justify-center" style={{ top: "3.2%" }}>
              <div
                className="flex items-center"
                style={{
                  gap: "8px",
                }}
              >
                <img
                  src="/logo.png"
                  alt="ProofPix"
                  style={{
                    height: "50.86px",
                    filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))",
                  }}
                  className="w-auto"
                />
                <span
                  style={{
                    fontWeight: "600",
                    fontSize: "32.2px",
                    lineHeight: "39px",
                    letterSpacing: "-0.146px",
                  }}
                  className="text-black"
                >
                  ProofPix
                </span>
              </div>
            </div>
            {/* Content — positioned from bottom so buttons always visible */}
            <div className="absolute left-0 right-0 bottom-0 flex flex-col items-center px-5" style={{ paddingBottom: "3%" }}>
              <h1 className="text-center text-black" style={{ width: "363px", maxWidth: "100%", fontSize: "28px", lineHeight: "36px", fontWeight: "600", letterSpacing: "-0.201242px" }}>
                Before &amp; After Photos—<br />Organized &amp; Professional
              </h1>
              <p className="text-center text-black" style={{ width: "348px", maxWidth: "100%", fontSize: "17px", lineHeight: "25px", fontWeight: "300", letterSpacing: "-0.201242px", marginTop: "14px" }}>
                Capture, organize, and share before/after photos without cluttering your gallery.
              </p>
              <div className="flex items-start rounded-full" style={{ width: "313px", padding: "10px 20px", marginTop: "14px", background: "rgba(255, 255, 255, 0.4)", border: "1px solid rgba(0, 0, 0, 0.24)" }}>
                <p style={{ fontSize: "14px", lineHeight: "17px", fontWeight: "300", letterSpacing: "-0.201242px" }} className="text-black text-center w-full">
                  For cleaners, contractors, Airbnb, inspectors, and field teams.
                </p>
              </div>
              <div className="flex items-center" style={{ gap: "21px", marginTop: "14px" }}>
                <a href="https://play.google.com/store/apps/details?id=com.proofpix.app" target="_blank" rel="noopener noreferrer" aria-label="Get ProofPix on Google Play">
                  <img src="/playstore.png" alt="Google Play" style={{ width: "162px", height: "54px", borderRadius: "13px" }} />
                </a>
                <a href="https://apps.apple.com/us/app/proofpix/id6754261444" target="_blank" rel="noopener noreferrer" aria-label="Download ProofPix on the App Store">
                  <img src="/applestore.png" alt="Apple App Store" style={{ width: "157px", height: "54px", borderRadius: "13px" }} />
                </a>
              </div>
              {/* Scroll indicator — scrolls to next section */}
              <button type="button" aria-label="Scroll to next section" onClick={() => document.getElementById('camera-chaos')?.scrollIntoView({ behavior: 'smooth' })} style={{ marginTop: "14px", background: "none", border: "none", padding: 0, cursor: "pointer" }}>
                <svg width="24" height="44" viewBox="0 0 24 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="1" width="22" height="30" rx="11" stroke="black" strokeWidth="2" fill="none" />
                  <rect x="11" y="7" width="2" height="6" rx="1" fill="black" />
                  <path d="M7 36 L12 42 L17 36" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </button>
            </div>
          </div>

          {/* Desktop hero */}
          <div className="mx-auto hidden w-full flex-1 flex-col items-center text-center sm:flex">
            <div style={{ backgroundColor: "rgba(255, 255, 255, 0.4)", fontFamily: "'Alexandria', sans-serif", fontWeight: "300", fontSize: "16px", lineHeight: "20px", letterSpacing: "-0.201242px", border: "1px solid rgba(0, 0, 0, 0.24)" }} className="mb-6 inline-flex rounded-full px-5 py-[10px] text-black" >
              For cleaners, contractors, Airbnb, inspectors, and field teams.
            </div>

            <h1 style={{ fontWeight: "600", fontSize: "52px", lineHeight: "63px", letterSpacing: "-0.201242px", width: "655px" }} className="mb-4 text-center text-proofpix-black">
              Before &amp; After Photos—
              <span className="block">Organized &amp; Professional</span>
            </h1>

            <p style={{ fontWeight: "300", fontSize: "28px", lineHeight: "34px", letterSpacing: "-0.201242px", width: "655px" }} className="mb-10 text-center text-black">
              Capture, organize, and share before/after photos without cluttering your
              gallery.
            </p>

            <div className="flex items-center justify-center" style={{ gap: "21px" }}>
              {/* Google Play Button */}
              <a href="https://play.google.com/store/apps/details?id=com.proofpix.app" target="_blank" rel="noopener noreferrer" aria-label="Get ProofPix on Google Play">
                <img style={{ width: "215px", height: "72px", borderRadius: "19px" }} src="/playstore.png" alt="Google Play" />
              </a>

              {/* Apple App Store Button */}
              <a href="https://apps.apple.com/us/app/proofpix/id6754261444" target="_blank" rel="noopener noreferrer" aria-label="Download ProofPix on the App Store">
                <img style={{ width: "208px", height: "72px", borderRadius: "19px" }} src="/applestore.png" alt="Apple App Store" />
              </a>
            </div>

            {/* Hero image — visible below the store buttons */}
            <div className="w-full mt-8 overflow-hidden" style={{ position: "relative" }}>
              <img
                src={HERO_DESKTOP_IMGS[heroIndex]}
                alt=""
                className="w-full h-auto block"
                loading="eager"
              />
              {/* Fade in at top, fade out at bottom */}
              <div className="absolute top-0 left-0 right-0" style={{ height: "80px", background: "linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0))" }} />
              <div className="absolute bottom-0 left-0 right-0" style={{ height: "80px", background: "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))" }} />
            </div>
          </div>
          </div>
        </section>

        {/* Your Work Photos section — replaces Camera Chaos heading */}
        <section id="camera-chaos" className="pt-8 sm:pt-20 px-4 sm:px-6">
          <div className="flex flex-col items-center" style={{ gap: "16px", marginBottom: "32px" }}>
            <h2 style={{ fontWeight: "600", letterSpacing: "-0.201242px" }} className="text-center text-[28px] leading-[36px] tracking-tight text-black lg:text-[44px] lg:leading-[62px]">
              From Camera Chaos to Clear Proof
            </h2>
            <p style={{ fontWeight: "300", fontSize: "27px", lineHeight: "130%", maxWidth: "1024px" }} className="hidden text-center text-[#2D2D2D] sm:block">
              Job photos buried in your camera roll don&apos;t prove anything. ProofPix pairs every before with its after, matches the angle automatically, and delivers branded documentation you can share in seconds.
            </p>
            <p style={{ fontWeight: "300", fontSize: "17px", lineHeight: "25px", letterSpacing: "-0.201242px" }} className="text-center text-[#2D2D2D] sm:hidden">
              Job photos buried in your camera roll don&apos;t prove anything. ProofPix pairs every before with its after, matches angles automatically, and delivers branded proof you can share in seconds.
            </p>
          </div>
          {/* Mobile/Tablet layout — single frame, dim within pairs, swipe between pairs */}
          <div className="mx-auto flex flex-col items-center lg:hidden" style={{ maxWidth: "420px", rowGap: "20px" }}>
            {/* Image frame — same style as desktop */}
            <div
              className="w-full"
              style={{
                overflow: "hidden",
                borderRadius: "48px 48px 0 0",
                border: "2px solid transparent",
                background:
                  "linear-gradient(#FFFFFF, #FFFFFF) padding-box, linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.05), rgba(0,0,0,0)) border-box",
                padding: "4px",
              }}
            >
              <div
                className="overflow-hidden w-full"
                style={{
                  borderRadius: "44px 44px 0 0",
                  background: "#FFFFFF",
                  position: "relative",
                  aspectRatio: "3/4",
                }}
              >
                {/* Each pair is a wrapper that swipes; before/after inside fade */}
                {BEFORE_AFTER_IMGS.map((pair, i) => {
                  const isActive = i === mobilePairIndex;
                  const isPrev = i === (mobilePairIndex - 1 + BEFORE_AFTER_PAIRS) % BEFORE_AFTER_PAIRS;
                  return (
                    <div
                      key={i}
                      className="absolute inset-0"
                      style={{
                        transition: (isActive || isPrev) ? "transform 0.5s ease" : "none",
                        transform: isActive ? "translateX(0)" : isPrev ? "translateX(100%)" : "translateX(-100%)",
                      }}
                    >
                      <img
                        src={pair.before}
                        alt="Before"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{
                          transition: "opacity 0.6s ease",
                          opacity: !mobileShowingAfter ? 1 : 0,
                        }}
                        loading="lazy"
                        decoding="async"
                      />
                      <img
                        src={pair.after}
                        alt="After"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{
                          transition: "opacity 0.6s ease",
                          opacity: mobileShowingAfter ? 1 : 0,
                        }}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  );
                })}
                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 z-10" style={{ height: "80px", background: "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))" }} />
              </div>
            </div>
            {/* Characteristics — progressively turn from red to green */}
            <div className="flex flex-col w-full" style={{ gap: "10px", paddingLeft: "16px" }}>
              {[
                { red: "Work photos mix with personal", green: "Work photos stay separate" },
                { red: "No project structure", green: "Projects keep photos grouped" },
                { red: "No consistent visual style", green: "Custom labels & watermark" },
                { red: "Hard to share with clients", green: "Easy client sharing" },
                { red: "Before/After gets out of order", green: "Bulk BEFORE → AFTER capture" },
                { red: "Angles don't match", green: "Ghost overlay for matching angles" },
              ].map((item, i) => {
                const isGreen = i < mobileGreenCount;
                return (
                  <div key={i} className="flex items-center" style={{ gap: "10px" }}>
                    {isGreen
                      ? <CheckCircle2 style={{ width: "28px", height: "28px", flexShrink: 0 }} className="text-emerald-500" />
                      : <AlertCircle style={{ width: "28px", height: "28px", flexShrink: 0 }} className="text-[#FF5A6C]" />
                    }
                    <span style={{ fontWeight: "300", fontSize: "14px", lineHeight: "20px", letterSpacing: "-0.201242px", transition: "color 0.4s ease" }} className="text-black">
                      {isGreen ? item.green : item.red}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop layout — full images above text; columns shrink on smaller screens */}
          <div className="hidden lg:flex items-start justify-center mx-auto w-full px-4" style={{ maxWidth: "1270px", gap: "clamp(24px, 5vw, 64px)" }}>
            {/* Left column — flex so it shrinks when viewport narrows */}
            <div className="flex flex-col flex-1 min-w-0" style={{ maxWidth: "420px", rowGap: "20px" }}>
              <div
                className="w-full"
                style={{
                  overflow: "hidden",
                  borderRadius: "68px 68px 0 0",
                  border: "2px solid transparent",
                  background:
                    "linear-gradient(#FFFFFF, #FFFFFF) padding-box, linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.05), rgba(0,0,0,0)) border-box",
                  padding: "6px",
                }}
              >
                <div
                  className="overflow-hidden w-full"
                  style={{
                    borderRadius: "62px 62px 0 0",
                    background: "#FFFFFF",
                    position: "relative",
                    aspectRatio: "3/4",
                  }}
                >
                  {BEFORE_AFTER_IMGS.map((pair, i) => {
                    const isActive = i === beforeAfterIndex;
                    const isPrev = i === (beforeAfterIndex - 1 + BEFORE_AFTER_PAIRS) % BEFORE_AFTER_PAIRS;
                    return (
                      <div
                        key={i}
                        className="absolute inset-0"
                        style={{
                          transition: (isActive || isPrev) ? "transform 0.5s ease" : "none",
                          transform: isActive ? "translateX(0)" : isPrev ? "translateX(100%)" : "translateX(-100%)",
                        }}
                      >
                        <img
                          src={pair.before}
                          alt="Before"
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    );
                  })}
                  <div className="absolute bottom-0 left-0 right-0 z-10" style={{ height: "100px", background: "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))" }} />
                </div>
              </div>
              <div className="flex flex-col min-w-0 justify-center" style={{ gap: "14px", paddingLeft: "clamp(16px, 3vw, 50px)" }}>
                <h3 style={{ fontWeight: "600", fontSize: "clamp(16px, 1.5vw, 20px)", lineHeight: "1.2", letterSpacing: "-0.201242px", whiteSpace: "nowrap" }} className="text-black">
                  The Camera App Isn&apos;t Built for Work
                </h3>
                {[
                  "Work photos mix with personal",
                  "Before/After gets out of order",
                  "Angles don\u2019t match",
                  "Hard to share with clients",
                  "No project structure",
                  "No consistent visual style",
                ].map((item) => (
                  <div key={item} className="flex items-center min-w-0" style={{ gap: "13px" }}>
                    <AlertCircle style={{ width: "39px", height: "39px", flexShrink: 0 }} className="text-[#FF5A6C]" />
                    <span style={{ fontWeight: "300", fontSize: "clamp(16px, 1.4vw, 20px)", lineHeight: "30px", letterSpacing: "-0.201242px" }} className="text-black">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow between frames */}
            <div className="flex-shrink-0 flex items-center justify-center" style={{ width: "clamp(56px, 8vw, 102px)", marginTop: "80px" }}>
              <ArrowRight className="text-[#1C274C] w-full h-auto" style={{ width: "clamp(48px, 6vw, 79px)", height: "auto" }} strokeWidth={1.5} />
            </div>

            {/* Right column — flex so it shrinks when viewport narrows */}
            <div className="flex flex-col flex-1 min-w-0" style={{ maxWidth: "420px", rowGap: "20px" }}>
              <div
                className="w-full"
                style={{
                  overflow: "hidden",
                  borderRadius: "68px 68px 0 0",
                  border: "2px solid transparent",
                  background:
                    "linear-gradient(#FFFFFF, #FFFFFF) padding-box, linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.05), rgba(0,0,0,0)) border-box",
                  padding: "6px",
                }}
              >
                <div
                  className="overflow-hidden w-full"
                  style={{
                    borderRadius: "62px 62px 0 0",
                    background: "#FFFFFF",
                    position: "relative",
                    aspectRatio: "3/4",
                  }}
                >
                  {BEFORE_AFTER_IMGS.map((pair, i) => {
                    const isActive = i === beforeAfterIndex;
                    const isPrev = i === (beforeAfterIndex - 1 + BEFORE_AFTER_PAIRS) % BEFORE_AFTER_PAIRS;
                    return (
                      <div
                        key={i}
                        className="absolute inset-0"
                        style={{
                          transition: (isActive || isPrev) ? "transform 0.5s ease" : "none",
                          transform: isActive ? "translateX(0)" : isPrev ? "translateX(100%)" : "translateX(-100%)",
                        }}
                      >
                        <img
                          src={pair.after}
                          alt="After"
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    );
                  })}
                  <div className="absolute bottom-0 left-0 right-0 z-10" style={{ height: "100px", background: "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))" }} />
                </div>
              </div>
              <div className="flex flex-col min-w-0 justify-center" style={{ gap: "14px", paddingLeft: "clamp(16px, 3vw, 50px)" }}>
                <h3 style={{ fontWeight: "600", fontSize: "clamp(16px, 1.5vw, 20px)", lineHeight: "1.2", letterSpacing: "-0.201242px", whiteSpace: "nowrap" }} className="text-black">
                  ProofPix Fixes That
                </h3>
                {[
                  "Work photos stay separate",
                  "Bulk BEFORE \u2192 AFTER capture",
                  "Ghost overlay for matching angles",
                  "Easy client sharing",
                  "Projects keep photos grouped",
                  "Custom labels & watermark",
                ].map((item) => (
                  <div key={item} className="flex items-center min-w-0" style={{ gap: "13px" }}>
                    <CheckCircle2 style={{ width: "39px", height: "39px", flexShrink: 0 }} className="text-[#1EC13B]" />
                    <span style={{ fontWeight: "300", fontSize: "clamp(16px, 1.4vw, 20px)", lineHeight: "30px", letterSpacing: "-0.201242px" }} className="text-black">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Key Features section */}
        <section id="features" className="pb-4">
          <h2 style={{ fontWeight: "600", fontSize: "44px", lineHeight: "62px", letterSpacing: "-0.201242px" }} className="mb-12 hidden text-center tracking-tight text-proofpix-black lg:block">
            Key Features
          </h2>

          {/* Desktop layout */}
          <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-8">
            {/* Left features */}
            <div className="flex flex-col" style={{ gap: "119px" }}>
              <button
                type="button"
                onClick={() => setKeyFeatureIndex(0)}
                className="flex items-center justify-end gap-4 text-left"
              >
                <div className="text-left">
                  <h4 style={{ fontWeight: "700", fontSize: "29px", lineHeight: "35px", letterSpacing: "-0.201242px" }} className="text-black">Bulk Capture</h4>
                  <p style={{ fontWeight: "300", fontSize: "26px", lineHeight: "32px", letterSpacing: "-0.201242px" }} className="text-black">Shoot before/after<br />without mixing</p>
                </div>
                <div className={`flex-shrink-0 rounded-sm ${keyFeatureIndex === 0 ? "bg-[#F2C31B]" : "bg-black/10"}`} style={{ width: "7px", height: "119px" }} />
              </button>

              <button
                type="button"
                onClick={() => setKeyFeatureIndex(1)}
                className="flex items-center justify-end gap-4 text-left"
              >
                <div className="text-left">
                  <h4 style={{ fontWeight: "700", fontSize: "29px", lineHeight: "35px", letterSpacing: "-0.201242px" }} className="text-black">Ghost Mode</h4>
                  <p style={{ fontWeight: "300", fontSize: "26px", lineHeight: "32px", letterSpacing: "-0.201242px" }} className="text-black">Match angles<br />instantly</p>
                </div>
                <div className={`flex-shrink-0 rounded-sm ${keyFeatureIndex === 1 ? "bg-[#F2C31B]" : "bg-black/10"}`} style={{ width: "7px", height: "119px" }} />
              </button>

              <button
                type="button"
                onClick={() => setKeyFeatureIndex(2)}
                className="flex items-center justify-end gap-4 text-left"
              >
                <div className="text-left">
                  <h4 style={{ fontWeight: "700", fontSize: "29px", lineHeight: "35px", letterSpacing: "-0.201242px" }} className="text-black">Custom Layouts</h4>
                  <p style={{ fontWeight: "300", fontSize: "26px", lineHeight: "32px", letterSpacing: "-0.201242px" }} className="text-black">Labels, fonts,<br />colors, watermark</p>
                </div>
                <div className={`flex-shrink-0 rounded-sm ${keyFeatureIndex === 2 ? "bg-[#F2C31B]" : "bg-black/10"}`} style={{ width: "7px", height: "119px" }} />
              </button>
            </div>

            {/* Phone mockup in center — frame and screen aligned, screenshot contained */}
            <div className="flex-shrink-0" style={{ width: "380px" }}>
              <div className="relative rounded-[2.5rem] border-[8px] border-neutral-800 bg-neutral-800 shadow-2xl">
                <div className="absolute left-1/2 top-0 z-10 h-5 w-24 -translate-x-1/2 rounded-b-xl bg-neutral-800" />
                <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[1.75rem] bg-black" style={{ borderRadius: "calc(2.5rem - 8px)" }}>
                  {KEY_FEATURE_IMAGES.map((img, i) => {
                    const isActive = i === keyFeatureIndex;
                    const isPrev = i === (keyFeatureIndex - 1 + KEY_FEATURE_IMAGES.length) % KEY_FEATURE_IMAGES.length;
                    return (
                      <div
                        key={i}
                        className="absolute inset-0"
                        style={{
                          transition: (isActive || isPrev) ? "transform 0.5s ease" : "none",
                          transform: isActive ? "translateX(0)" : isPrev ? "translateX(100%)" : "translateX(-100%)",
                        }}
                      >
                        <img
                          src={img}
                          alt={KEY_FEATURES_MOBILE[i].title}
                          className="h-full w-full object-cover"
                          style={{ objectPosition: "50% -2px" }}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right features */}
            <div className="flex flex-col" style={{ gap: "119px" }}>
              <button
                type="button"
                onClick={() => setKeyFeatureIndex(3)}
                className="flex items-center gap-4 text-left"
              >
                <div className={`flex-shrink-0 rounded-sm ${keyFeatureIndex === 3 ? "bg-[#F2C31B]" : "bg-black/10"}`} style={{ width: "7px", height: "119px" }} />
                <div>
                  <h4 style={{ fontWeight: "700", fontSize: "29px", lineHeight: "35px", letterSpacing: "-0.201242px" }} className="text-black">Project Organization</h4>
                  <p style={{ fontWeight: "300", fontSize: "26px", lineHeight: "32px", letterSpacing: "-0.201242px" }} className="text-black">No gallery clutter</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setKeyFeatureIndex(4)}
                className="flex items-center gap-4 text-left"
              >
                <div className={`flex-shrink-0 rounded-sm ${keyFeatureIndex === 4 ? "bg-[#F2C31B]" : "bg-black/10"}`} style={{ width: "7px", height: "119px" }} />
                <div>
                  <h4 style={{ fontWeight: "700", fontSize: "29px", lineHeight: "35px", letterSpacing: "-0.201242px" }} className="text-black">Drive/Dropbox Linking</h4>
                  <p style={{ fontWeight: "300", fontSize: "26px", lineHeight: "32px", letterSpacing: "-0.201242px" }} className="text-black">Use your cloud</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setKeyFeatureIndex(5)}
                className="flex items-center gap-4 text-left"
              >
                <div className={`flex-shrink-0 rounded-sm ${keyFeatureIndex === 5 ? "bg-[#F2C31B]" : "bg-black/10"}`} style={{ width: "7px", height: "119px" }} />
                <div>
                  <h4 style={{ fontWeight: "700", fontSize: "29px", lineHeight: "35px", letterSpacing: "-0.201242px" }} className="text-black">Team Uploads</h4>
                  <p style={{ fontWeight: "300", fontSize: "26px", lineHeight: "32px", letterSpacing: "-0.201242px" }} className="text-black">Simple field workflow</p>
                </div>
              </button>
            </div>
          </div>

            {/* Mobile layout — refined phone view + feature card + dots */}
          <div className="lg:hidden px-4" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <h3 style={{ fontWeight: "600", fontSize: "28px", lineHeight: "36px", letterSpacing: "-0.201242px" }} className="mb-8 text-center text-black">
              Key Features
            </h3>

            {/* Phone device — same frame as desktop (9:19, 2.5rem radius, 8px bezel), scaled for mobile */}
            <div className="mx-auto mb-8" style={{ width: "min(280px, 100%)" }}>
              <div className="relative rounded-[2.5rem] border-[8px] border-neutral-800 bg-neutral-800 shadow-2xl">
                <div className="absolute left-1/2 top-0 z-10 h-5 w-24 -translate-x-1/2 rounded-b-xl bg-neutral-800" />
                <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[1.75rem] bg-black" style={{ borderRadius: "calc(2.5rem - 8px)" }}>
                  {KEY_FEATURE_IMAGES.map((img, i) => {
                    const isActive = i === keyFeatureIndex;
                    const isPrev = i === (keyFeatureIndex - 1 + KEY_FEATURE_IMAGES.length) % KEY_FEATURE_IMAGES.length;
                    return (
                      <div
                        key={i}
                        className="absolute inset-0"
                        style={{
                          transition: (isActive || isPrev) ? "transform 0.5s ease" : "none",
                          transform: isActive ? "translateX(0)" : isPrev ? "translateX(100%)" : "translateX(-100%)",
                        }}
                      >
                        <img
                          src={img}
                          alt={KEY_FEATURES_MOBILE[i].title}
                          className="h-full w-full object-cover"
                          style={{ objectPosition: "50% -2px" }}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Feature label + paginator dots */}
            <div className="mx-auto flex flex-col items-center" style={{ gap: "16px", maxWidth: "276px" }}>
              <div className="text-center">
                <h4 style={{ fontWeight: "700", fontSize: "21px", lineHeight: "25px", letterSpacing: "-0.201242px" }} className="text-black">
                  {KEY_FEATURES_MOBILE[keyFeatureIndex].title}
                </h4>
                <p style={{ fontWeight: "300", fontSize: "17px", lineHeight: "25px", letterSpacing: "-0.201242px" }} className="mt-1 text-black">
                  {KEY_FEATURES_MOBILE[keyFeatureIndex].description}
                </p>
              </div>
              <div className="flex items-center" style={{ gap: "9px" }}>
                {KEY_FEATURES_MOBILE.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Feature ${i + 1}: ${KEY_FEATURES_MOBILE[i].title}`}
                    onClick={() => setKeyFeatureIndex(i)}
                    className="rounded-full transition-all duration-200"
                    style={{ width: "10px", height: "10px", background: i === keyFeatureIndex ? "#F2C31B" : "#D9D9D9" }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases section — horizontal scroll on mobile, grid on sm+ */}
        <section id="use-cases" className="mx-auto w-full overflow-x-hidden py-16 px-4 sm:px-6">
          <h2 style={{ fontWeight: "600", letterSpacing: "-0.201242px" }} className="mb-8 text-center text-[28px] leading-[36px] tracking-tight text-black lg:text-[44px] lg:leading-[62px]">
            Use Cases
          </h2>
          {/* Mobile: horizontal scrollable row */}
          <div className="flex w-full min-w-0 overflow-x-auto px-4 pb-2 lg:hidden" style={{ gap: "16px", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}>
            {[
              { img: "cleaning.png", label: "Cleaning &\nAirbnb" },
              { img: "renovation.png", label: "Renovation &\nConstruction" },
              { img: "landscaping.png", label: "Landscaping" },
              { img: "auto-dealing.png", label: "Auto\nDetailing" },
              { img: "property_inspection.png", label: "Property\nInspections" },
            ].map((item) => (
              <div key={item.label} className="flex flex-shrink-0 flex-col items-center justify-center" style={{ scrollSnapAlign: "start", width: "149px", height: "195px", borderRadius: "20px", border: "1px solid rgba(0,0,0,0.5)" }}>
                <img src={`/${item.img}`} alt={item.label} style={{ width: "71px", height: "71px" }} className="object-contain mb-3" loading="lazy" decoding="async" />
                <span style={{ fontWeight: "300", fontSize: "17px", lineHeight: "25px", letterSpacing: "-0.201242px" }} className="whitespace-pre-line text-center text-black">{item.label}</span>
              </div>
            ))}
            {/* "If your job has Before/After, ProofPix fits." card */}
            <div className="flex flex-shrink-0 flex-col items-center justify-center" style={{ scrollSnapAlign: "start", width: "149px", height: "195px", borderRadius: "20px", border: "1px solid rgba(0,0,0,0.5)" }}>
              <span style={{ fontWeight: "800", fontSize: "17px", lineHeight: "25px", letterSpacing: "-0.201242px" }} className="text-center text-black">If your job has</span>
              <span style={{ fontWeight: "800", fontSize: "17px", lineHeight: "25px", letterSpacing: "-0.201242px" }} className="text-center text-neutral-400">Before / After,</span>
              <span style={{ fontWeight: "800", fontSize: "17px", lineHeight: "25px", letterSpacing: "-0.201242px" }} className="text-center text-black">ProofPix fits.</span>
            </div>
          </div>
          {/* Desktop: Figma grid */}
          <div className="mx-auto hidden lg:flex flex-row flex-wrap justify-center" style={{ maxWidth: "1270px", gap: "29px" }} >
            {[
              { img: "cleaning.png", label: "Cleaning & Airbnb" },
              { img: "renovation.png", label: "Renovation &\nConstruction" },
              { img: "landscaping.png", label: "Landscaping" },
              { img: "auto-dealing.png", label: "Auto Detailing" },
              { img: "property_inspection.png", label: "Property Inspections" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center justify-center" style={{ width: "404px", height: "289px", borderRadius: "38px", border: "1px solid rgba(0,0,0,0.5)" }}>
                <img src={`/${item.img}`} alt={item.label} style={{ width: "121px", height: "121px" }} className="object-contain mb-4" loading="lazy" decoding="async" />
                <span style={{ fontWeight: "500", fontSize: "29px", lineHeight: "35px", letterSpacing: "-0.201242px" }} className="whitespace-pre-line text-center text-black">{item.label}</span>
              </div>
            ))}
            <div className="flex flex-col items-center justify-center" style={{ width: "404px", height: "289px", borderRadius: "38px", border: "1px solid rgba(0,0,0,0.5)" }}>
              <span style={{ fontWeight: "800", fontSize: "41px", lineHeight: "63px", letterSpacing: "-0.201242px" }} className="text-center text-black">If your job has</span>
              <span style={{ fontWeight: "800", fontSize: "41px", lineHeight: "63px", letterSpacing: "-0.201242px" }} className="text-center text-neutral-400">Before / After,</span>
              <span style={{ fontWeight: "800", fontSize: "41px", lineHeight: "63px", letterSpacing: "-0.201242px" }} className="text-center text-black">ProofPix fits.</span>
            </div>
          </div>
        </section>

        {/* Trusted by Service Pros — testimonial card on mobile, stats on sm+ */}
        <section className="mx-auto max-w-full px-4 py-12 lg:py-[100px] lg:px-[62px]">
          {/* Headline + Subhead */}
          <div className="flex flex-col items-center" style={{ gap: "38.71px", marginBottom: "68px" }}>
            <h2 style={{ fontWeight: "600", letterSpacing: "-0.201242px" }} className="text-center text-[28px] leading-[36px] tracking-tight text-black lg:text-[44px] lg:leading-[62px]">
              Trusted by Service Pros
            </h2>
            {/* Mobile: single testimonial card */}
            <div className="mx-auto sm:hidden" style={{ width: "341px" }}>
              <div className="flex flex-col items-center bg-white" style={{ padding: "20px 30px", gap: "20px", border: "1px solid #AAAAAA", borderRadius: "20px" }}>
                <div className="flex flex-col items-center" style={{ gap: "10px" }}>
                  {/* Client info */}
                  <div className="flex flex-col items-center" style={{ gap: "16px" }}>
                    <div className="overflow-hidden rounded-full bg-neutral-200" style={{ width: "56px", height: "56px" }}>
                      <div className="flex h-full w-full items-center justify-center text-xl text-neutral-400">SK</div>
                    </div>
                    <div className="flex flex-col items-start" style={{ gap: "6px" }}>
                      <p style={{ fontWeight: "600", fontSize: "21px", lineHeight: "130%" }} className="w-full text-center text-[#111827]">Sarah K.</p>
                      <p style={{ fontWeight: "300", fontSize: "14px", lineHeight: "160%" }} className="w-full text-center text-[#374151]">(Site Engineer)</p>
                    </div>
                  </div>
                  {/* Quote */}
                  <p style={{ fontWeight: "400", fontSize: "16px", lineHeight: "150%" }} className="text-center text-[#2D2D2D]">
                    &ldquo;As a Site Engineer managing multiple active sites, my camera roll used to be a disaster zone of concrete pours, rebar checks, and drywall framing—all mixed in with my personal photos. ProofPix has completely streamlined how I document progress. It isn&apos;t just a camera app; it&apos;s a dispute-prevention tool.&rdquo;
                  </p>
                </div>
                {/* Stars */}
                <div className="flex justify-center" style={{ gap: "5px" }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} style={{ width: "24px", height: "23px" }} className="fill-[#F8D57E] text-[#F8D57E]" />
                  ))}
                </div>
              </div>
            </div>
            {/* Desktop/tablet: subtitle */}
            <p style={{ fontWeight: "300", fontSize: "27px", lineHeight: "130%", maxWidth: "1024px" }} className="hidden text-center text-[#2D2D2D] sm:block">
              Our metrics component gives you the inside scoop on your success and helps
              you stay on top of your game in style.
            </p>
          </div>
          {/* Metric cards */}
          <div className="mx-auto hidden sm:flex flex-row items-start" style={{ gap: "38.71px", maxWidth: "1316px" }}>
            {[
              { value: "5000+", label: "Photos Created" },
              { value: "400+", label: "Projects created" },
              { value: "2,400+", label: "Service pros\nusing ProofPix" },
              { value: "50+", label: "Industries\nserved" },
            ].map((stat) => (
              <div
                key={stat.value}
                className="flex flex-1 flex-col items-center justify-center bg-white"
                style={{
                  padding: "58px 31px",
                  gap: "9.68px",
                  height: "271px",
                  borderBottom: "7.74px solid #F2C31B",
                  boxShadow: "67.46px 57.34px 93.56px rgba(242, 195, 27, 0.16)",
                  borderRadius: "38.71px 38.71px 0 0",
                }}
              >
                <span style={{ fontWeight: "600", fontSize: "54px", lineHeight: "130%", letterSpacing: "-0.01em" }} className="text-center text-[#2D2D2D]">
                  {stat.value}
                </span>
                <span style={{ fontWeight: "400", fontSize: "29px", lineHeight: "130%" }} className="whitespace-pre-line text-center text-[#2D2D2D]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing section */}
        <section id="pricing" style={{ background: "rgba(242, 195, 27, 0.07)" }} className="px-4 py-12 lg:py-[100px] lg:px-[62px]">
          {/* Headline & Subhead */}
          <div className="flex flex-col items-center" style={{ gap: "18.71px", marginBottom: "68px" }}>
            <h2 style={{ fontWeight: "600", letterSpacing: "-0.201242px" }} className="text-center text-[28px] leading-[36px] tracking-tight text-black lg:text-[44px] lg:leading-[62px]">
              <span className="sm:hidden">Pricing</span>
              <span className="hidden sm:inline">Simple, Transparent Pricing</span>
            </h2>
            <div style={{ backgroundColor: "rgba(255, 255, 255, 0.4)", border: "1px solid rgba(0, 0, 0, 0.24)" }} className="rounded-full px-5 py-[10px] text-center">
              <span style={{ fontWeight: "300", letterSpacing: "-0.201242px" }} className="text-black text-[14px] leading-[17px] lg:text-[16px] lg:leading-[20px]">
                30-day trial included.
              </span>
            </div>
          </div>
          {/* Pricing cards */}
          <div className="mx-auto flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:items-stretch lg:flex-nowrap" style={{ maxWidth: "1316px", gap: "28px" }}>
            {[
              {
                name: "Starter",
                price: "$0",
                period: "/ month",
                desc: "For individuals getting started.",
                features: [
                  "Capture & pair before/after photos",
                  "Match angles with photo overlay",
                  "Flexible layouts (vertical, square, horizontal)",
                  "Share individual photos",
                ],
              },
              {
                name: "Pro",
                price: "$8.99",
                period: "/ month",
                desc: "For solo professionals.",
                features: [
                  "Everything in Starter",
                  "Bulk sharing & cloud uploads",
                  "Custom labels, colors & watermark",
                  "Unlimited projects",
                ],
              },
              {
                name: "Business",
                price: "$24.99",
                period: "/ month\n+ seats",
                desc: "For small teams.",
                features: [
                  "Everything in Pro",
                  "Up to 5 team members",
                  "Shared cloud access",
                  "Consistent team workflows",
                ],
              },
              {
                name: "Enterprise",
                price: "$69.99",
                period: "/ month",
                desc: "For growing organizations.",
                features: [
                  "Everything in Business",
                  "Up to 15 team members",
                  "Multiple locations & profiles",
                  "Scalable, high-volume workflows",
                ],
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className="flex flex-col justify-between bg-white w-[338px] lg:w-0 lg:flex-1 lg:min-w-0"
                style={{
                  minHeight: "480px",
                  padding: "20px",
                  gap: "30px",
                  boxShadow: "0px 10px 30px rgba(242, 195, 27, 0.35)",
                  borderRadius: "20px",
                }}
              >
                {/* Text content */}
                <div className="flex flex-col" style={{ gap: "24px" }}>
                  {/* Pricing info */}
                  <div className="flex flex-col" style={{ gap: "6px" }}>
                    <h3 style={{ fontWeight: "600", fontSize: "28px", lineHeight: "150%" }} className="text-[#2D2D2D]">{plan.name}</h3>
                    <div className="flex items-baseline" style={{ gap: "12px" }}>
                      <span style={{ fontWeight: "700", letterSpacing: "-0.02em" }} className="text-[#2D2D2D] text-[28px] leading-[36px] lg:text-[42px] lg:leading-[130%]">
                        {plan.price}
                      </span>
                      <span style={{ fontWeight: "700", fontSize: "16px", lineHeight: "160%" }} className="whitespace-pre-line text-[#3B3B3B]">
                        {plan.period}
                      </span>
                    </div>
                    <p style={{ fontWeight: "400", fontSize: "16px", lineHeight: "160%" }} className="text-[#2D2D2D]">{plan.desc}</p>
                  </div>
                  {/* Features */}
                  <ul className="flex flex-col" style={{ gap: "14px" }}>
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start" style={{ gap: "12px" }}>
                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#009379]" strokeWidth={2.5} />
                        <span style={{ fontWeight: "331", fontSize: "16px", lineHeight: "1.5" }} className="text-[#2D2D2D]">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Button */}
                <button
                  className="w-full text-center text-black transition hover:bg-neutral-50"
                  style={{
                    padding: "16px 50px",
                    border: "1px solid rgba(0, 0, 0, 0.3)",
                    borderRadius: "20px",
                    fontWeight: "500",
                    fontSize: "19px",
                    lineHeight: "24px",
                  }}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ROI Numbers Section */}
        <section className="mx-auto w-full overflow-x-hidden py-16 px-4 sm:px-6">
          <h2 style={{ fontWeight: "600", letterSpacing: "-0.201242px" }} className="mb-2 text-center text-[28px] leading-[36px] tracking-tight text-black lg:text-[44px] lg:leading-[62px]">
            The Real Value of ProofPix
          </h2>
          <p style={{ fontWeight: "300", fontSize: "27px", lineHeight: "130%", maxWidth: "1024px" }} className="hidden mb-10 text-center text-[#2D2D2D] sm:block mx-auto">
            Clear before-and-after proof saves time, prevents disputes, and turns job photos into marketing content.
          </p>
          <p style={{ fontWeight: "300", fontSize: "17px", lineHeight: "25px", letterSpacing: "-0.201242px" }} className="mb-10 text-center text-[#2D2D2D] sm:hidden">
            Clear before-and-after proof saves time, prevents disputes, and turns job photos into marketing content.
          </p>

          {(() => {
            const commonNote = "Assumes a 5% complaint rate, $100 avg complaint cost, and ~10 min to manually create before/after documentation per job.";
            const tiers = [
              { name: "Starter", price: "$0", tooltip: "Solo professional, 1 job/day (22 jobs/month). ~10% of jobs produce shareable photos worth ~$5 each without branding." },
              { name: "Pro", price: "$8.99", tooltip: "Solo professional, 1 job/day (22 jobs/month). Branded photos generate ~$10 per marketing image, ~10% of jobs produce usable content." },
              { name: "Business", price: "$24.99", tooltip: "5-person team, 1.5 jobs/day per worker (~165 jobs/month). ~10% of jobs produce marketing-ready photos worth ~$10 each." },
              { name: "Enterprise", price: "$69.99", tooltip: "15-person team, 3 jobs/day per worker (~990 jobs/month). ~5% of jobs produce marketing content, ~$10 value per image." },
            ];
            const rows = [
              { icon: "/icon-time.svg", label: "Time saved", values: ["5.4 hrs", "6.4 hrs", "43 hrs", "238 hrs"], color: "#2563EB", tooltip: "Monthly hours saved vs. manually creating before/after documentation." },
              { icon: "/icon-complaints.svg", label: "Complaints reduced", values: ["~50%", "~50%", "~50%", "~50%"], color: "#009379", tooltip: "Estimated reduction in customer complaints when visual proof is provided." },
              { icon: "/icon-marketing.svg", label: "Dispute costs prevented", values: ["$50", "$50", "$400", "$2,500"], color: "#D97706", tooltip: "Monthly savings from avoided disputes, based on complaint rate and average resolution cost." },
              { icon: "/icon-disputes.svg", label: "Marketing value", values: ["$10", "$75", "$160", "$500"], color: "#7C3AED", tooltip: "Estimated monthly revenue from using job photos as marketing content." },
              { icon: "/icon-price.svg", label: "Plan price", values: ["$0", "$8.99", "$24.99", "$69.99"], color: "#111", isPrice: true },
            ];
            return (
              <>
                {/* Mobile: transposed table — tiers as rows, metrics as columns */}
                <div className="lg:hidden pb-2">
                  <table className="w-full" style={{ borderSpacing: "0" }}>
                    <thead>
                      <tr>
                        <th style={{ width: "90px" }}></th>
                        {rows.map((row) => (
                          <th key={row.label} className="text-center px-1 pb-3">
                            {row.icon ? (
                              <div className="relative flex flex-col items-center">
                                <button
                                  onClick={() => setActiveRowLabel(activeRowLabel === row.label ? null : row.label)}
                                  className="flex items-center justify-center"
                                  style={{ width: "36px", height: "36px", borderRadius: "10px", background: `${row.color}14` }}
                                >
                                  <img src={row.icon} alt={row.label} style={{ width: "20px", height: "20px", filter: "brightness(0)" }} />
                                </button>
                                {activeRowLabel === row.label && (
                                  <div className="absolute top-[40px] z-50 whitespace-nowrap px-3 py-1.5 bg-[#2D2D2D] text-white text-[12px] rounded-lg shadow-xl" style={{ fontWeight: "500" }}>
                                    {row.label}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span style={{ fontWeight: "600", fontSize: "11px" }} className="text-[#333]">{row.label}</span>
                            )}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tiers.map((t, ti) => (
                        <tr key={t.name}>
                          <td className="py-3 pr-2" style={{ borderBottom: ti < tiers.length - 1 ? "1px solid rgba(0,0,0,0.08)" : "none" }}>
                            <div className="relative">
                              <button
                                onClick={() => setActiveTierName(activeTierName === t.name ? null : t.name)}
                                className="flex items-center"
                                style={{ gap: "2px" }}
                              >
                                <span style={{ fontWeight: "600", fontSize: "14px", lineHeight: "1.3", textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: "3px", textDecorationColor: "#ccc" }} className="text-black">{t.name}</span>
                              </button>
                              {activeTierName === t.name && (
                                <div className="absolute left-0 top-[28px] z-50 w-[220px] p-3 bg-[#2D2D2D] text-white text-[12px] leading-[1.5] rounded-xl shadow-xl text-left" style={{ fontWeight: "350" }}>
                                  <span className="block mb-1 text-[10px] uppercase tracking-wider text-[#F2C31B]" style={{ fontWeight: "600" }}>Methodology</span>
                                  {t.tooltip}
                                </div>
                              )}
                            </div>
                          </td>
                          {rows.map((row) => (
                            <td key={row.label} className="text-center py-3 px-1" style={{ borderBottom: ti < tiers.length - 1 ? "1px solid rgba(0,0,0,0.08)" : "none", fontWeight: "700", fontSize: row.isPrice ? "16px" : "14px", color: row.isPrice ? "#009379" : "#2D2D2D" }}>
                              {row.values[ti]}{row.isPrice && <span style={{ fontWeight: "400", fontSize: "10px", color: "#888" }}>/mo</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-center mt-4 px-2">
                    <span style={{ fontWeight: "300", fontSize: "11px", lineHeight: "1.4", color: "#888" }}>{commonNote}</span>
                  </p>
                </div>

                {/* Desktop: transposed table — tiers as rows, metrics as columns */}
                <div className="mx-auto hidden lg:block" style={{ maxWidth: "1270px" }}>
                  <div style={{ borderRadius: "38px", border: "1px solid rgba(0,0,0,0.5)" }}>
                    <table className="w-full" style={{ borderSpacing: "0" }}>
                      <thead>
                        <tr>
                          <th style={{ width: "220px", padding: "28px 32px", textAlign: "left", borderBottom: "1px solid rgba(0,0,0,0.1)" }}></th>
                          {rows.map((row, ri) => (
                            <th key={row.label} className="text-center" style={{ padding: "28px 16px", borderBottom: "1px solid rgba(0,0,0,0.1)", borderLeft: "1px solid rgba(0,0,0,0.1)" }}>
                              <div className="flex flex-col items-center" style={{ gap: "8px" }}>
                                {row.icon && (
                                  <div className="flex items-center justify-center" style={{ width: "44px", height: "44px", borderRadius: "12px", background: `${row.color}14` }}>
                                    <img src={row.icon} alt="" style={{ width: "24px", height: "24px", filter: "brightness(0)" }} />
                                  </div>
                                )}
                                <div className="inline-flex items-center" style={{ gap: "4px" }}>
                                  <span style={{ fontWeight: "600", fontSize: "16px", lineHeight: "1.3", letterSpacing: "-0.201242px" }} className="text-black">{row.label}</span>
                                  {row.tooltip && (
                                    <div className="group relative inline-flex">
                                      <Info className="h-3.5 w-3.5 text-[#bbb] cursor-pointer" />
                                      <div className="pointer-events-none opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 absolute top-6 z-50 w-[260px] p-3 bg-[#2D2D2D] text-white text-[13px] leading-[1.5] rounded-xl shadow-xl text-left" style={{ fontWeight: "350", ...(ri >= 3 ? { right: 0 } : { left: "50%", transform: "translateX(-50%)" }) }}>
                                        <span className="block mb-1 text-[11px] uppercase tracking-wider text-[#F2C31B]" style={{ fontWeight: "600" }}>How we calculated this</span>
                                        {row.tooltip}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tiers.map((t, ti) => (
                          <tr key={t.name} className="hover:bg-[rgba(242,195,27,0.04)] transition-colors">
                            <td style={{ padding: "24px 32px", borderBottom: ti < tiers.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
                              <div className="flex items-center" style={{ gap: "8px" }}>
                                <span style={{ fontWeight: "600", fontSize: "22px", lineHeight: "1.4", letterSpacing: "-0.201242px" }} className="text-black">{t.name}</span>
                                <div className="group relative inline-flex">
                                  <Info className="h-4 w-4 text-[#bbb] cursor-pointer" />
                                  <div className="pointer-events-none opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 absolute left-6 top-0 z-50 w-[280px] p-4 bg-[#2D2D2D] text-white text-[13px] leading-[1.6] rounded-xl shadow-xl text-left" style={{ fontWeight: "350" }}>
                                    <span className="block mb-1 text-[11px] uppercase tracking-wider text-[#F2C31B]" style={{ fontWeight: "600" }}>Methodology</span>
                                    {t.tooltip}
                                  </div>
                                </div>
                              </div>
                            </td>
                            {rows.map((row) => (
                              <td key={row.label} className="text-center" style={{ padding: "24px 16px", borderBottom: ti < tiers.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none", borderLeft: "1px solid rgba(0,0,0,0.1)", fontWeight: "700", fontSize: row.isPrice ? "26px" : "22px", letterSpacing: "-0.02em", color: row.isPrice ? "#009379" : "#2D2D2D" }}>
                                {row.values[ti]}{row.isPrice && <span style={{ fontWeight: "400", fontSize: "16px", color: "#888" }}> /mo</span>}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-center mt-5">
                    <span style={{ fontWeight: "300", fontSize: "14px", lineHeight: "1.4", color: "#888" }}>{commonNote}</span>
                  </p>
                </div>
              </>
            );
          })()}
        </section>

        {/* FAQ Section */}
        <section id="faq" className="mx-auto w-full py-16 px-4 sm:px-6">
          <h2 style={{ fontWeight: "600", letterSpacing: "-0.201242px" }} className="mb-10 text-center text-[28px] leading-[36px] tracking-tight text-black lg:text-[44px] lg:leading-[62px]">
            Frequently Asked Questions
          </h2>
          <div className="mx-auto flex flex-col" style={{ maxWidth: "800px", gap: "24px" }}>
            {[
              {
                q: "What is ProofPix?",
                a: "ProofPix is a before-and-after photo documentation app built specifically for service professionals. It helps cleaners, contractors, property inspectors, Airbnb hosts, landscapers, and field teams capture, organize, and share professional before-and-after photos without cluttering their personal camera roll. Unlike your regular camera app, ProofPix keeps work photos in dedicated projects, matches angles with ghost overlay, and lets you add custom labels and watermarks for a professional look.",
              },
              {
                q: "Is ProofPix free?",
                a: "Yes, ProofPix offers a free Starter plan that includes before/after photo capture, angle matching with photo overlay, flexible layouts (vertical, square, horizontal), and the ability to share individual photos. For advanced features like bulk sharing, cloud uploads, custom labels and watermarks, and unlimited projects, the Pro plan is $8.99 per month. Team plans start at $24.99 per month. All paid plans include a 30-day free trial.",
              },
              {
                q: "How does Ghost Mode work?",
                a: "Ghost Mode is one of ProofPix's most popular features. When you're taking an 'after' photo, Ghost Mode overlays a semi-transparent version of your original 'before' shot on the camera viewfinder. This lets you match the exact same angle, distance, and framing so your before-and-after comparisons look consistent and professional. It's especially useful for renovation projects, cleaning jobs, and property inspections where angle consistency matters.",
              },
              {
                q: "Does ProofPix work on iPhone and Android?",
                a: "Yes, ProofPix is available on both iOS (iPhone and iPad) and Android devices. You can download it from the Apple App Store or Google Play Store. Your account syncs across devices, so you can capture photos on one device and access them from another.",
              },
              {
                q: "Can I share photos with clients?",
                a: "Absolutely. ProofPix makes it easy to share professional before-and-after photos with clients. You can share individual photos or entire projects. With the Pro plan and above, you get bulk sharing capabilities and can upload directly to Google Drive or Dropbox. Photos can include your custom labels, colors, and watermark for a branded, professional presentation.",
              },
              {
                q: "How is ProofPix different from my camera app?",
                a: "Your phone's built-in camera app mixes work photos with personal ones, has no project structure, doesn't help you match angles, and offers no way to add professional labels or watermarks. ProofPix solves all of these problems: it keeps work photos in dedicated projects, uses Ghost Mode for angle matching, supports bulk before/after capture so photos never get out of order, and lets you customize layouts with your branding. It's purpose-built for the way service professionals actually work.",
              },
            ].map((item, i) => (
              <details key={i} className="group border border-black/10 rounded-2xl overflow-hidden">
                <summary
                  className="flex items-center justify-between cursor-pointer px-6 py-5 select-none"
                  style={{ fontWeight: "600", fontSize: "18px", lineHeight: "24px", letterSpacing: "-0.201242px" }}
                >
                  <span className="text-black pr-4">{item.q}</span>
                  <span className="text-black/40 group-open:rotate-45 transition-transform text-2xl flex-shrink-0">+</span>
                </summary>
                <div className="px-6 pb-5">
                  <p style={{ fontWeight: "300", fontSize: "16px", lineHeight: "26px", letterSpacing: "-0.201242px" }} className="text-[#333]">
                    {item.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA Banner — Mobile */}
        <section className="lg:hidden flex flex-col items-center bg-white" style={{ padding: "31.44px" }}>
          <div className="relative w-full overflow-hidden flex flex-col items-center" style={{ height: "469.94px", background: "#F2C31B", borderRadius: "20.96px" }}>
            {/* Decorative shapes — behind phone at bottom */}
            <div className="absolute" style={{ width: "149.88px", height: "149.88px", left: "13.1px", bottom: "-25px", border: "23.5441px solid #000000", borderRadius: "50%", zIndex: 0 }} />
            <div className="absolute" style={{ width: "149.88px", height: "149.88px", left: "170.41px", bottom: "-50px", background: "#000000", borderRadius: "50%", zIndex: 0 }} />
            {/* Content */}
            <div className="relative flex flex-col items-center" style={{ padding: "22.92px 31.44px", gap: "21.92px", zIndex: 2 }}>
              <div className="flex flex-col items-center text-center" style={{ gap: "20.96px", width: "297.24px" }}>
                <p style={{ fontWeight: "400", fontSize: "16px", lineHeight: "150%" }} className="text-black w-full text-center">
                  No registration and credit card required.
                </p>
                <h2 style={{ fontWeight: "600", fontSize: "23.34px", lineHeight: "130%", letterSpacing: "-0.01em" }} className="text-black w-full text-center">
                  Stop Losing Photos. Start Showing Results.
                </h2>
              </div>
              <div className="flex items-center" style={{ gap: "21px" }}>
                <a href="https://play.google.com/store/apps/details?id=com.proofpix.app" target="_blank" rel="noopener noreferrer" aria-label="Get ProofPix on Google Play">
                  <img src="playstore.png" alt="Google Play" style={{ width: "137px", height: "46px", borderRadius: "10px" }} />
                </a>
                <a href="https://apps.apple.com/us/app/proofpix/id6754261444" target="_blank" rel="noopener noreferrer" aria-label="Download ProofPix on the App Store">
                  <img src="applestore.png" alt="Apple App Store" style={{ width: "137px", height: "48px", borderRadius: "10px" }} />
                </a>
              </div>
            </div>
            {/* Phone mockup area */}
            <div className="relative w-full flex-1" style={{ overflow: "hidden" }}>
              <div className="absolute left-1/2" style={{ width: "215.92px", transform: "translateX(calc(-50% - 0.54px))", top: "5.77px", zIndex: 2, filter: "drop-shadow(10.39px 14.02px 19.68px rgba(0, 0, 0, 0.15))" }}>
                <div className="relative" style={{ background: "linear-gradient(12deg, #FFFFFF 2%, #D2D2D2 56%, #FFFFFF 88%)", border: "0.55px solid #D1D1D1", borderRadius: "38.75px", padding: "6px" }}>
                  <div className="overflow-hidden" style={{ borderRadius: "33.22px", border: "0.55px solid #2D2D2D" }}>
                    <img src="/appscreenshot.png" alt="ProofPix App" className="w-full h-auto block" loading="lazy" decoding="async" />
                  </div>
                  {/* Notch */}
                  <div className="absolute left-1/2 -translate-x-1/2" style={{ top: "10.52px", width: "66.52px", height: "14.39px", background: "#FFFFFF", borderRadius: "55.36px" }}>
                    <div className="absolute left-1/2 -translate-x-1/2" style={{ top: "6.09px", width: "29.9px", height: "2.21px", background: "#CFCFCF", borderRadius: "4.43px" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner — Desktop */}
        <section className="hidden lg:block" style={{ padding: "20px 62px" }}>
          <div className="relative overflow-hidden flex flex-row items-start" style={{ background: "#F2C31B", borderRadius: "22.5px", maxWidth: "1316px", margin: "0 auto", height: "488px" }}>
            {/* Decorative ring — behind phone emulator */}
            <div className="absolute" style={{ width: "293.62px", height: "293.62px", right: "150px", bottom: "-73px", border: "46.125px solid #000000", borderRadius: "50%", zIndex: 0 }} />
            {/* Decorative solid circle — top right */}
            <div className="absolute" style={{ width: "293.62px", height: "293.62px", right: "-80px", top: "-103.5px", background: "#000000", borderRadius: "50%", zIndex: 0 }} />

            {/* Content */}
            <div className="relative flex flex-col items-start" style={{ padding: "50px 0 50px 67.5px", gap: "36px", width: "659px", zIndex: 2 }}>
              <div className="flex flex-col items-start" style={{ gap: "18px" }}>
                <p style={{ fontWeight: "400", fontSize: "28px", lineHeight: "130%", letterSpacing: "-0.02em" }} className="text-black">
                  No registration and credit card required.
                </p>
                <h2 style={{ fontWeight: "700", fontSize: "48px", lineHeight: "130%", letterSpacing: "-0.02em" }} className="text-black">
                  Stop Losing Photos.<br />Start Showing Results.
                </h2>
              </div>
              <div className="flex items-center" style={{ gap: "21px" }}>
                <a href="https://play.google.com/store/apps/details?id=com.proofpix.app" target="_blank" rel="noopener noreferrer" aria-label="Get ProofPix on Google Play">
                  <img src="playstore.png" alt="Google Play" style={{ width: "215px", height: "72px", borderRadius: "19px" }} />
                </a>
                <a href="https://apps.apple.com/us/app/proofpix/id6754261444" target="_blank" rel="noopener noreferrer" aria-label="Download ProofPix on the App Store">
                  <img src="applestore.png" alt="Apple App Store" style={{ width: "208px", height: "72px", borderRadius: "19px" }} />
                </a>
              </div>
            </div>

            {/* Phone mockup */}
            <div className="relative flex-shrink-0" style={{ width: "657px", height: "488px", borderRadius: "22.5px", overflow: "visible", zIndex: 2 }}>
              <div className="absolute" style={{ width: "400px", left: "167px", top: "30px", filter: "drop-shadow(19px 26px 36px rgba(0, 0, 0, 0.15))" }}>
                <div className="relative" style={{ background: "linear-gradient(12deg, #FFFFFF 2%, #D2D2D2 56%, #FFFFFF 88%)", border: "1px solid #D1D1D1", borderRadius: "72px", padding: "11px" }}>
                  <div className="overflow-hidden" style={{ borderRadius: "62px", border: "1px solid #2D2D2D" }}>
                    <img src="/appscreenshot.png" alt="ProofPix App" className="w-full h-auto block" loading="lazy" decoding="async" />
                  </div>
                  {/* Notch */}
                  <div className="absolute left-1/2 -translate-x-1/2" style={{ top: "20px", width: "123px", height: "27px", background: "#FFFFFF", borderRadius: "103px" }}>
                    <div className="absolute left-1/2 -translate-x-1/2" style={{ top: "11px", width: "55px", height: "4px", background: "#CFCFCF", borderRadius: "8px" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer — mobile: black bg stacked layout; desktop: Figma spec */}
      <footer className="bg-black lg:bg-white text-white lg:text-black">
        {/* Mobile footer */}
        <div className="lg:hidden flex flex-col" style={{ background: "#000000" }}>
          {/* Main content */}
          <div className="flex flex-col" style={{ padding: "48px 25px 0", gap: "25px" }}>
            {/* Logo + description */}
            <div className="flex flex-col" style={{ gap: "25px" }}>
              <div className="flex items-center" style={{ gap: "9.31px" }}>
                <img src="/logo.png" alt="ProofPix" style={{ height: "59.19px" }} className="w-auto" />
                <span style={{ fontWeight: "600", fontSize: "37.4648px", lineHeight: "46px", letterSpacing: "-0.170294px" }} className="text-white">ProofPix</span>
              </div>
              <p style={{ fontSize: "17px", lineHeight: "26px", fontWeight: "500" }} className="text-white">No more searching, sorting, or editing. ProofPix instantly organizes your before-and-after photos for ready-to-share social media posts.</p>
            </div>
            {/* Quick Links + Legal columns */}
            <div className="flex flex-row" style={{ gap: "59px" }}>
              <nav className="flex flex-col" style={{ width: "95px" }}>
                <div style={{ padding: "12px 0" }}>
                  <span style={{ fontWeight: "700", fontSize: "16px", lineHeight: "140%", color: "#D9D9D9" }}>Quick Links</span>
                </div>
                <a href="#features" style={{ padding: "12px 0", fontWeight: "400", fontSize: "16px", lineHeight: "140%", color: "#D9D9D9", display: "block" }}>Features</a>
                <a href="#pricing" style={{ padding: "12px 0", fontWeight: "400", fontSize: "16px", lineHeight: "140%", color: "#D9D9D9", display: "block" }}>Pricing</a>
                <a href="#use-cases" style={{ padding: "12px 0", fontWeight: "400", fontSize: "16px", lineHeight: "140%", color: "#D9D9D9", display: "block" }}>Use Cases</a>
                <a href="#faq" style={{ padding: "12px 0", fontWeight: "400", fontSize: "16px", lineHeight: "140%", color: "#D9D9D9", display: "block" }}>FAQ</a>
                <a href="#contact" style={{ padding: "12px 0", fontWeight: "400", fontSize: "16px", lineHeight: "140%", color: "#D9D9D9", display: "block" }}>Contact</a>
              </nav>
              <nav className="flex flex-col" style={{ width: "154px" }}>
                <div style={{ padding: "12px 0" }}>
                  <span style={{ fontWeight: "700", fontSize: "16px", lineHeight: "140%", color: "#D9D9D9" }}>Legal</span>
                </div>
                <a href="https://www.geos-ai.com/privacy.html" target="_blank" rel="noopener noreferrer" style={{ padding: "12px 0", fontWeight: "400", fontSize: "16px", lineHeight: "140%", color: "#D9D9D9", display: "block" }}>Privacy Policy</a>
                <a href="https://www.geos-ai.com/terms.html" target="_blank" rel="noopener noreferrer" style={{ padding: "12px 0", fontWeight: "400", fontSize: "16px", lineHeight: "140%", color: "#D9D9D9", display: "block" }}>Terms &amp; Conditions</a>
              </nav>
            </div>
          </div>
          {/* Copyright bar */}
          <div className="flex justify-center items-center" style={{ padding: "15px 100px", borderTop: "1px solid rgba(255, 255, 255, 0.25)" }}>
            <span style={{ fontWeight: "325", fontSize: "14px", lineHeight: "180%", color: "#FFFFFF", whiteSpace: "nowrap" }}>&copy; 2026 ProofPix &middot; <a href="https://geos-ai.com/" target="_blank" rel="noopener noreferrer" style={{ color: "#FFFFFF" }}>Geos LLC</a></span>
          </div>
        </div>

        {/* Desktop footer — Figma spec */}
        <div className="hidden lg:flex flex-col items-end mx-auto" style={{ maxWidth: "1315.62px", padding: "0 62px", gap: "16px", paddingBottom: "40px" }}>
          {/* Row 1: logo + nav links */}
          <div className="flex flex-row justify-between items-center w-full" style={{ height: "59.19px" }}>
            <div className="flex items-center" style={{ gap: "9.31px" }}>
              <img src="/logo.png" alt="ProofPix" style={{ height: "59.19px" }} className="w-auto" />
              <span style={{ fontWeight: "600", fontSize: "37.4648px", lineHeight: "46px", letterSpacing: "-0.170294px" }} className="text-black">ProofPix</span>
            </div>
            <nav className="flex flex-row items-center" style={{ gap: "36px" }}>
              <a href="#features" style={{ fontWeight: "400", fontSize: "15px", lineHeight: "26px", letterSpacing: "-0.1px" }} className="text-[#161C2D]">Features</a>
              <a href="#pricing" style={{ fontWeight: "400", fontSize: "15px", lineHeight: "26px", letterSpacing: "-0.1px" }} className="text-[#161C2D]">Pricing</a>
              <a href="#use-cases" style={{ fontWeight: "400", fontSize: "15px", lineHeight: "26px", letterSpacing: "-0.1px" }} className="text-[#161C2D]">Use Cases</a>
              <a href="#faq" style={{ fontWeight: "400", fontSize: "15px", lineHeight: "26px", letterSpacing: "-0.1px" }} className="text-[#161C2D]">FAQ</a>
              <a href="#contact" style={{ fontWeight: "400", fontSize: "15px", lineHeight: "26px", letterSpacing: "-0.1px" }} className="text-[#161C2D]">Contact</a>
            </nav>
          </div>

          {/* Divider */}
          <div className="w-full" style={{ height: "0px", opacity: 0.2, borderBottom: "1px solid #000000" }} />

          {/* Row 2: copyright + legal */}
          <div className="flex flex-row justify-between items-center w-full">
            <span style={{ fontWeight: "400", fontSize: "15px", lineHeight: "26px", letterSpacing: "-0.1px" }} className="text-black">
              &copy; 2026 ProofPix &middot; <a href="https://geos-ai.com/" target="_blank" rel="noopener noreferrer">Geos LLC</a>
            </span>
            <nav className="flex flex-row items-center" style={{ gap: "36px" }}>
              <a href="https://www.geos-ai.com/privacy.html" target="_blank" rel="noopener noreferrer" style={{ fontWeight: "400", fontSize: "15px", lineHeight: "26px", letterSpacing: "-0.1px" }} className="text-[#161C2D]">Privacy Policy</a>
              <a href="https://www.geos-ai.com/terms.html" target="_blank" rel="noopener noreferrer" style={{ fontWeight: "400", fontSize: "15px", lineHeight: "26px", letterSpacing: "-0.1px" }} className="text-[#161C2D]">Terms &amp; Conditions</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
