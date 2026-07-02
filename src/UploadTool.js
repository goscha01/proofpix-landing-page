import { useState, useRef, useCallback } from "react";
import { logAnalytics, logStoreClick } from "./analytics";

// Match native app label customization (SettingsContext + LabelCustomizationScreen +
// PhotoLabel.js + rooms.js LABEL_POSITIONS). User can adjust color/size/corner/
// position the same way they would on-device. Watermark mirrors PhotoWatermark.js
// defaults and is intentionally NOT user-editable on the landing page (non-removable).
const LABEL_FONT = "Alexandria, sans-serif";
const LABEL_FONT_WEIGHT = 700;

// Per PhotoLabel.js LABEL_SIZE_MAP (small/medium/large) — all measurements in CSS px
// at the in-app "photo" scale (~400px wide). For the high-res 1080px output canvas
// we multiply these by `labelScale` so labels keep the same visual proportion.
const LABEL_SIZE_MAP = {
  small: { fontSize: 12, padH: 10, padV: 4, radius: 4, minWidth: 70 },
  medium: { fontSize: 14, padH: 12, padV: 6, radius: 6, minWidth: 88 },
  large: { fontSize: 16, padH: 16, padV: 8, radius: 8, minWidth: 104 },
};

// 9 positions — same keys/order as rooms.js LABEL_POSITIONS, laid out as a 3x3 grid
// with rows = top/middle/bottom and columns = left/center/right.
const POSITION_KEYS = [
  "left-top", "center-top", "right-top",
  "left-middle", "center-middle", "right-middle",
  "left-bottom", "center-bottom", "right-bottom",
];

const DEFAULT_BEFORE_POSITION = "left-top";
const DEFAULT_AFTER_POSITION = "right-top";
const DEFAULT_LABEL_BG = "#FFD700";
const DEFAULT_LABEL_TEXT = "#000000";
const DEFAULT_LABEL_SIZE = "medium";
const DEFAULT_LABEL_CORNER = "rounded"; // 'rounded' | 'square'
const DEFAULT_LABEL_MARGIN = 10;

// Background-color and text-color presets — small palette covering the bright/dark/
// safe options you'd reach for first. Power users still get the full spectrum via
// the `<input type="color">` swatch on the right.
const BG_PALETTE = [
  "#FFD700", "#FF3B30", "#FF9500", "#34C759", "#007AFF",
  "#AF52DE", "#FFFFFF", "#000000",
];
const TEXT_PALETTE = ["#000000", "#FFFFFF", "#FFD700", "#FF3B30", "#34C759", "#007AFF"];

// Watermark = non-removable on landing page. Always rendered with these values.
const WATERMARK_TEXT = "Created with ProofPix.app";
const WATERMARK_COLOR = "#FFD700";
const WATERMARK_OPACITY = 0.5;
const WATERMARK_POSITION = "right-bottom";

// Compute absolute-position CSS for a label at a given position key. Mirrors
// rooms.js getLabelPositions(): margin from the relevant edges, with translate
// transforms for the middle/center cases.
function getPositionStyle(positionKey, marginV = DEFAULT_LABEL_MARGIN, marginH = DEFAULT_LABEL_MARGIN) {
  const [horizontal, vertical] = positionKey.split("-");
  const style = { position: "absolute" };
  // Vertical
  if (vertical === "top") style.top = marginV;
  else if (vertical === "bottom") style.bottom = marginV;
  else style.top = "50%";
  // Horizontal
  if (horizontal === "left") style.left = marginH;
  else if (horizontal === "right") style.right = marginH;
  else style.left = "50%";
  // Translate for centered axes
  const tx = horizontal === "center" ? "-50%" : "0";
  const ty = vertical === "middle" ? "-50%" : "0";
  if (tx !== "0" || ty !== "0") style.transform = `translate(${tx}, ${ty})`;
  return style;
}

// Steps: upload → preview → generating → result → qualification
const STEPS = { UPLOAD: 0, PREVIEW: 1, GENERATING: 2, RESULT: 3, QUALIFY: 4 };

// 3x3 grid of selectable position dots — same axis layout as the in-app picker.
function PositionGrid({ value, onChange, accent = "#FFD700" }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "4px",
        padding: "6px",
        background: "#f5f5f5",
        borderRadius: "8px",
        width: "fit-content",
      }}
    >
      {POSITION_KEYS.map((key) => {
        const active = key === value;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-label={`Position ${key}`}
            aria-pressed={active}
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "4px",
              border: active ? `2px solid ${accent}` : "1px solid rgba(0,0,0,0.15)",
              background: active ? accent : "#fff",
              cursor: "pointer",
              padding: 0,
            }}
          />
        );
      })}
    </div>
  );
}

// Color row: preset swatches + native color input for arbitrary hex.
function ColorRow({ label, value, onChange, palette }) {
  return (
    <div className="flex items-center" style={{ gap: "8px" }}>
      <span style={{ fontWeight: 500, fontSize: "12px", minWidth: "62px" }} className="text-[#555]">{label}</span>
      <div className="flex items-center" style={{ gap: "4px", flexWrap: "wrap" }}>
        {palette.map((hex) => {
          const active = hex.toLowerCase() === value.toLowerCase();
          return (
            <button
              key={hex}
              type="button"
              onClick={() => onChange(hex)}
              aria-label={`Color ${hex}`}
              aria-pressed={active}
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                border: active ? "2px solid #000" : "1px solid rgba(0,0,0,0.15)",
                background: hex,
                cursor: "pointer",
                padding: 0,
              }}
            />
          );
        })}
        <label
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            border: "1px dashed rgba(0,0,0,0.3)",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "conic-gradient(#FF3B30, #FF9500, #FFD700, #34C759, #007AFF, #AF52DE, #FF2D55, #FF3B30)",
          }}
          title="Custom color"
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ width: 0, height: 0, opacity: 0, position: "absolute" }}
          />
        </label>
      </div>
    </div>
  );
}

// Segmented toggle (Size: S/M/L, Corner: Rounded/Square).
function Segmented({ options, value, onChange, ariaLabel }) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      style={{ display: "inline-flex", background: "#f3f3f3", borderRadius: "8px", padding: "2px" }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: active ? 600 : 400,
              background: active ? "#FFD700" : "transparent",
              color: "#000",
              border: "none",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// The full customization panel that lives in the PREVIEW step. Mirrors the
// in-app LabelCustomizationScreen options that apply to the BEFORE/AFTER
// labels: background color, text color, size, corner style, and per-label
// position. Watermark is intentionally NOT customizable — see WATERMARK_*
// constants above (non-removable on the landing page).
function LabelCustomizer({
  labelBg, setLabelBg,
  labelText, setLabelText,
  labelSize, setLabelSize,
  labelCorner, setLabelCorner,
  beforePosition, setBeforePosition,
  afterPosition, setAfterPosition,
}) {
  return (
    <div
      className="mb-4"
      style={{
        background: "#fafafa",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: "12px",
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div style={{ fontWeight: 600, fontSize: "12px", color: "#333", letterSpacing: "0.04em", textTransform: "uppercase" }}>
        Customize labels
      </div>

      <ColorRow label="Background" value={labelBg} onChange={setLabelBg} palette={BG_PALETTE} />
      <ColorRow label="Text" value={labelText} onChange={setLabelText} palette={TEXT_PALETTE} />

      <div className="flex flex-wrap items-center" style={{ gap: "12px" }}>
        <div className="flex items-center" style={{ gap: "8px" }}>
          <span style={{ fontWeight: 500, fontSize: "12px" }} className="text-[#555]">Size</span>
          <Segmented
            ariaLabel="Label size"
            value={labelSize}
            onChange={setLabelSize}
            options={[
              { value: "small", label: "S" },
              { value: "medium", label: "M" },
              { value: "large", label: "L" },
            ]}
          />
        </div>
        <div className="flex items-center" style={{ gap: "8px" }}>
          <span style={{ fontWeight: 500, fontSize: "12px" }} className="text-[#555]">Corners</span>
          <Segmented
            ariaLabel="Corner style"
            value={labelCorner}
            onChange={setLabelCorner}
            options={[
              { value: "rounded", label: "Rounded" },
              { value: "square", label: "Square" },
            ]}
          />
        </div>
      </div>

      <div className="flex flex-wrap" style={{ gap: "16px" }}>
        <div>
          <div style={{ fontWeight: 500, fontSize: "12px", marginBottom: "4px" }} className="text-[#555]">BEFORE position</div>
          <PositionGrid value={beforePosition} onChange={setBeforePosition} />
        </div>
        <div>
          <div style={{ fontWeight: 500, fontSize: "12px", marginBottom: "4px" }} className="text-[#555]">AFTER position</div>
          <PositionGrid value={afterPosition} onChange={setAfterPosition} />
        </div>
      </div>
    </div>
  );
}

function UploadToolModal({ onClose }) {
  const [step, setStep] = useState(STEPS.UPLOAD);
  const [images, setImages] = useState([null, null]); // [before, after] as { file, url }
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState(null);
  const [layout, setLayout] = useState("side"); // "side" or "stack"

  // --- Label customization (matches in-app LabelCustomizationScreen options) ---
  const [labelBg, setLabelBg] = useState(DEFAULT_LABEL_BG);
  const [labelText, setLabelText] = useState(DEFAULT_LABEL_TEXT);
  const [labelSize, setLabelSize] = useState(DEFAULT_LABEL_SIZE);
  const [labelCorner, setLabelCorner] = useState(DEFAULT_LABEL_CORNER);
  const [beforePosition, setBeforePosition] = useState(DEFAULT_BEFORE_POSITION);
  const [afterPosition, setAfterPosition] = useState(DEFAULT_AFTER_POSITION);

  const beforeInputRef = useRef(null);
  const afterInputRef = useRef(null);
  const canvasRef = useRef(null);

  // Both slot inputs accept `multiple`. If the user picks 1 photo, fill the targeted
  // slot. If they pick 2+ from the same dialog (e.g., a folder multi-select), fill
  // both slots in one shot — older `lastModified` → BEFORE, newer → AFTER. The Swap-
  // order button on the PREVIEW step is the escape hatch if the heuristic is wrong.
  const handleSlotPick = useCallback((index, e) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = ""; // allow re-picking the same files
    setError(null);
    if (picked.length === 0) return;

    const imageFiles = picked.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      setError("That file type isn't supported. Please upload an image.");
      logAnalytics("landing_upload_invalid", { reason: "unsupported_file" });
      return;
    }

    // Multi-select path: 2+ images → assign both slots by mtime.
    if (imageFiles.length >= 2) {
      const sorted = imageFiles.slice().sort((a, b) => {
        if (a.lastModified !== b.lastModified) return a.lastModified - b.lastModified;
        return a.name.localeCompare(b.name);
      });
      const [beforeFile, afterFile] = sorted;
      setImages((prev) => {
        prev.forEach((img) => img && URL.revokeObjectURL(img.url));
        return [
          { file: beforeFile, url: URL.createObjectURL(beforeFile) },
          { file: afterFile, url: URL.createObjectURL(afterFile) },
        ];
      });
      setTimeout(() => {
        setStep(STEPS.PREVIEW);
        logAnalytics("landing_upload_photos_selected", {
          selected_count: imageFiles.length,
          method: "bulk",
        });
      }, 0);
      return;
    }

    // Single-file path: fill just the targeted slot, advance only when both are set.
    const file = imageFiles[0];
    setImages((prev) => {
      const next = [...prev];
      if (next[index]) URL.revokeObjectURL(next[index].url);
      next[index] = { file, url: URL.createObjectURL(file) };
      if (next[0] && next[1]) {
        setTimeout(() => {
          setStep(STEPS.PREVIEW);
          logAnalytics("landing_upload_photos_selected", { selected_count: 2, method: "single" });
        }, 0);
      }
      return next;
    });
  }, []);

  const handleSwap = useCallback(() => {
    setImages((prev) => [prev[1], prev[0]]);
    logAnalytics("landing_upload_reordered");
  }, []);

  const handleGenerate = useCallback(() => {
    setStep(STEPS.GENERATING);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const beforeImg = new Image();
    const afterImg = new Image();
    let loaded = 0;

    const onBothLoaded = () => {
      loaded++;
      if (loaded < 2) return;

      try {
        const isSide = layout === "side";
        // Target: 1080px wide for side-by-side, 1080 for stack
        const targetW = 1080;
        const gap = 4; // thin gap between photos

        // Calculate individual image dimensions
        const bAspect = beforeImg.naturalWidth / beforeImg.naturalHeight;
        const aAspect = afterImg.naturalWidth / afterImg.naturalHeight;

        let canvasW, canvasH, bx, by, bw, bh, ax, ay, aw, ah;

        if (isSide) {
          // Side by side — each gets half width minus gap
          const halfW = Math.floor((targetW - gap) / 2);
          const bH = Math.floor(halfW / bAspect);
          const aH = Math.floor(halfW / aAspect);
          const maxH = Math.max(bH, aH);
          canvasW = targetW;
          canvasH = maxH;
          bx = 0; by = Math.floor((maxH - bH) / 2); bw = halfW; bh = bH;
          ax = halfW + gap; ay = Math.floor((maxH - aH) / 2); aw = halfW; ah = aH;
        } else {
          // Stack — each gets full width, stacked vertically
          const bH = Math.floor(targetW / bAspect);
          const aH = Math.floor(targetW / aAspect);
          canvasW = targetW;
          canvasH = bH + gap + aH;
          bx = 0; by = 0; bw = targetW; bh = bH;
          ax = 0; ay = bH + gap; aw = targetW; ah = aH;
        }

        canvas.width = canvasW;
        canvas.height = canvasH;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvasW, canvasH);

        // Draw images
        ctx.drawImage(beforeImg, bx, by, bw, bh);
        ctx.drawImage(afterImg, ax, ay, aw, ah);

        // --- Labels: render with the user's chosen color/size/corner/position. ---
        // Native sizes (PhotoLabel.js LABEL_SIZE_MAP) are tuned for on-device photos
        // ~400px wide; multiply by `labelScale` so they read at 1080px canvas size.
        const sizeCfg = LABEL_SIZE_MAP[labelSize] || LABEL_SIZE_MAP.medium;
        const labelScale = (canvasW / 400) * 0.55;
        const fontSize = Math.round(sizeCfg.fontSize * labelScale);
        const padH = Math.round(sizeCfg.padH * labelScale);
        const padV = Math.round(sizeCfg.padV * labelScale);
        const borderR = labelCorner === "square" ? 0 : Math.round(sizeCfg.radius * labelScale);
        const margin = Math.round(DEFAULT_LABEL_MARGIN * labelScale);
        const minLabelW = Math.round(sizeCfg.minWidth * labelScale);

        ctx.font = `${LABEL_FONT_WEIGHT} ${fontSize}px ${LABEL_FONT}`;
        ctx.textBaseline = "middle";

        // Map a position key to canvas-pixel (x, y) for a label of size (lw, lh)
        // sitting on an image rect (imgX, imgY, imgW, imgH).
        const resolvePosition = (positionKey, imgX, imgY, imgW, imgH, lw, lh) => {
          const [hAxis, vAxis] = positionKey.split("-");
          let x, y;
          if (hAxis === "left") x = imgX + margin;
          else if (hAxis === "right") x = imgX + imgW - margin - lw;
          else x = imgX + (imgW - lw) / 2;
          if (vAxis === "top") y = imgY + margin;
          else if (vAxis === "bottom") y = imgY + imgH - margin - lh;
          else y = imgY + (imgH - lh) / 2;
          return { x, y };
        };

        const drawLabel = (text, imgX, imgY, imgW, imgH, positionKey) => {
          const metrics = ctx.measureText(text);
          const lw = Math.max(metrics.width + padH * 2, minLabelW);
          const lh = fontSize + padV * 2;
          const { x: lx, y: ly } = resolvePosition(positionKey, imgX, imgY, imgW, imgH, lw, lh);

          ctx.fillStyle = labelBg;
          ctx.beginPath();
          ctx.roundRect(lx, ly, lw, lh, borderR);
          ctx.fill();

          ctx.fillStyle = labelText;
          ctx.textAlign = "center";
          ctx.fillText(text, lx + lw / 2, ly + lh / 2);
        };

        drawLabel("BEFORE", bx, by, bw, bh, beforePosition);
        drawLabel("AFTER", ax, ay, aw, ah, afterPosition);

        // --- Watermark: non-removable. Always Alexandria 700/14px-scaled, yellow
        //     #FFD700 @0.5 opacity, bottom-right of the entire collage canvas. ---
        const wmFontSize = Math.round(LABEL_SIZE_MAP.medium.fontSize * labelScale);
        const wmPadH = Math.round(LABEL_SIZE_MAP.medium.padH * labelScale);
        const wmPadV = Math.round(LABEL_SIZE_MAP.medium.padV * labelScale);
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.font = `${LABEL_FONT_WEIGHT} ${wmFontSize}px ${LABEL_FONT}`;
        ctx.globalAlpha = WATERMARK_OPACITY;
        ctx.fillStyle = WATERMARK_COLOR;
        const wmMetrics = ctx.measureText(WATERMARK_TEXT);
        const wmX = canvasW - wmMetrics.width - margin - wmPadH;
        const wmY = canvasH - margin - wmPadV;
        ctx.fillText(WATERMARK_TEXT, wmX, wmY);
        ctx.globalAlpha = 1;

        const url = canvas.toDataURL("image/jpeg", 0.92);
        setResultUrl(url);
        setStep(STEPS.RESULT);
        logAnalytics("landing_collage_generated");
      } catch (err) {
        setError("We couldn't generate the collage. Please try again.");
        setStep(STEPS.PREVIEW);
        logAnalytics("landing_collage_failed");
      }
    };

    beforeImg.onload = onBothLoaded;
    afterImg.onload = onBothLoaded;
    beforeImg.src = images[0].url;
    afterImg.src = images[1].url;
  }, [images, layout, labelBg, labelText, labelSize, labelCorner, beforePosition, afterPosition]);

  const handleDownload = useCallback(() => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "proofpix-before-after.jpg";
    a.click();
  }, [resultUrl]);

  const handleClose = useCallback(() => {
    logAnalytics("landing_tool_closed");
    // Cleanup object URLs
    images.forEach((img) => img && URL.revokeObjectURL(img.url));
    onClose();
  }, [images, onClose]);

  const handleQualify = useCallback((answer) => {
    logAnalytics("landing_qualification_answered", { user_type: answer });
    handleClose();
  }, [handleClose]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} onClick={handleClose}>
      <div
        className="relative bg-white w-full max-w-[520px] mx-4 overflow-y-auto"
        style={{ borderRadius: "24px", maxHeight: "90vh", boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <span style={{ fontWeight: "600", fontSize: "18px", letterSpacing: "-0.2px" }} className="text-black">
            {step <= STEPS.PREVIEW ? "Create Before & After" : step === STEPS.GENERATING ? "Generating..." : "Your Before & After"}
          </span>
          <button onClick={handleClose} className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/5 transition" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="px-6 pb-6">
          {/* UPLOAD STEP */}
          {step === STEPS.UPLOAD && (
            <div className="flex flex-col items-center py-6">
              <p style={{ fontWeight: "400", fontSize: "14px" }} className="text-[#595959] mb-5 text-center">Upload a before and after image from your device</p>
              {error && <p style={{ fontWeight: "500", fontSize: "13px" }} className="text-red-500 mb-3">{error}</p>}
              <div className="flex w-full" style={{ gap: "12px" }}>
                {[0, 1].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => (idx === 0 ? beforeInputRef : afterInputRef).current?.click()}
                    className="flex-1 flex flex-col items-center justify-center overflow-hidden transition hover:border-[#FFD700]"
                    style={{
                      height: images[idx] ? "auto" : "160px",
                      borderRadius: "16px",
                      border: images[idx] ? "2px solid #FFD700" : "2px dashed rgba(0,0,0,0.15)",
                      background: images[idx] ? "#000" : "#fafafa",
                      padding: 0,
                    }}
                  >
                    {images[idx] ? (
                      <div className="relative w-full">
                        <img src={images[idx].url} alt={idx === 0 ? "Before" : "After"} className="w-full h-auto object-cover" style={{ maxHeight: "180px" }} />
                        <span
                          className="absolute"
                          style={{
                            top: "6px",
                            ...(idx === 0 ? { left: "6px" } : { right: "6px" }),
                            background: DEFAULT_LABEL_BG,
                            color: DEFAULT_LABEL_TEXT,
                            fontFamily: LABEL_FONT,
                            fontWeight: LABEL_FONT_WEIGHT,
                            fontSize: "10px",
                            lineHeight: 1.2,
                            padding: "3px 8px",
                            borderRadius: "4px",
                            minWidth: "56px",
                            textAlign: "center",
                            pointerEvents: "none",
                          }}
                        >
                          {idx === 0 ? "BEFORE" : "AFTER"}
                        </span>
                      </div>
                    ) : (
                      <>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                        <span style={{ fontWeight: "600", fontSize: "13px", marginTop: "8px" }} className="text-[#595959]">{idx === 0 ? "Before" : "After"}</span>
                        <span style={{ fontWeight: "300", fontSize: "11px", marginTop: "2px" }} className="text-[#767676]">Tap to upload</span>
                      </>
                    )}
                  </button>
                ))}
              </div>
              <input ref={beforeInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleSlotPick(0, e)} />
              <input ref={afterInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleSlotPick(1, e)} />
              <p style={{ fontWeight: "300", fontSize: "12px" }} className="text-[#595959] mt-4">No signup required</p>
            </div>
          )}

          {/* PREVIEW STEP */}
          {step === STEPS.PREVIEW && images[0] && images[1] && (
            <div className="flex flex-col">
              {/* Layout toggle */}
              <div className="flex items-center justify-center mb-4" style={{ gap: "8px" }}>
                <button
                  onClick={() => setLayout("side")}
                  className="px-3 py-1.5 rounded-lg text-[13px] transition"
                  style={{ fontWeight: layout === "side" ? "600" : "400", background: layout === "side" ? "#FFD700" : "#f3f3f3", color: "#000" }}
                >
                  Side by Side
                </button>
                <button
                  onClick={() => setLayout("stack")}
                  className="px-3 py-1.5 rounded-lg text-[13px] transition"
                  style={{ fontWeight: layout === "stack" ? "600" : "400", background: layout === "stack" ? "#FFD700" : "#f3f3f3", color: "#000" }}
                >
                  Stacked
                </button>
              </div>

              {/* Preview */}
              <div className={`flex ${layout === "side" ? "flex-row" : "flex-col"} mb-4`} style={{ gap: "6px" }}>
                {images.map((img, i) => {
                  const isAfter = i === 1;
                  const positionKey = isAfter ? afterPosition : beforePosition;
                  const sizeCfg = LABEL_SIZE_MAP[labelSize] || LABEL_SIZE_MAP.medium;
                  // Scale label visuals down for the small modal preview tiles so
                  // proportions match what the canvas will render at full resolution.
                  const previewScale = 0.75;
                  return (
                    <div key={i} className="relative flex-1 overflow-hidden" style={{ borderRadius: "12px", border: "1px solid rgba(0,0,0,0.08)" }}>
                      <img src={img.url} alt={isAfter ? "After" : "Before"} className="w-full h-auto object-cover" style={{ maxHeight: layout === "side" ? "260px" : "200px" }} />
                      <span
                        className="absolute"
                        style={{
                          ...getPositionStyle(positionKey),
                          background: labelBg,
                          color: labelText,
                          fontFamily: LABEL_FONT,
                          fontWeight: LABEL_FONT_WEIGHT,
                          fontSize: `${Math.round(sizeCfg.fontSize * previewScale)}px`,
                          lineHeight: 1.2,
                          padding: `${Math.round(sizeCfg.padV * previewScale)}px ${Math.round(sizeCfg.padH * previewScale)}px`,
                          borderRadius: labelCorner === "square" ? 0 : `${Math.round(sizeCfg.radius * previewScale)}px`,
                          minWidth: `${Math.round(sizeCfg.minWidth * previewScale)}px`,
                          textAlign: "center",
                          pointerEvents: "none",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {isAfter ? "AFTER" : "BEFORE"}
                      </span>
                      {/* Non-removable watermark on the last tile (mirrors final canvas output) */}
                      {((layout === "side" && i === 1) || (layout === "stack" && i === 1)) && (
                        <span
                          className="absolute"
                          style={{
                            ...getPositionStyle(WATERMARK_POSITION),
                            color: WATERMARK_COLOR,
                            fontFamily: LABEL_FONT,
                            fontWeight: LABEL_FONT_WEIGHT,
                            fontSize: "10px",
                            lineHeight: 1.2,
                            opacity: WATERMARK_OPACITY,
                            padding: "2px 6px",
                            borderRadius: "4px",
                            whiteSpace: "nowrap",
                            pointerEvents: "none",
                            userSelect: "none",
                          }}
                        >
                          {WATERMARK_TEXT}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Label customization (mirrors LabelCustomizationScreen on-device) */}
              <LabelCustomizer
                labelBg={labelBg} setLabelBg={setLabelBg}
                labelText={labelText} setLabelText={setLabelText}
                labelSize={labelSize} setLabelSize={setLabelSize}
                labelCorner={labelCorner} setLabelCorner={setLabelCorner}
                beforePosition={beforePosition} setBeforePosition={setBeforePosition}
                afterPosition={afterPosition} setAfterPosition={setAfterPosition}
              />

              {/* Swap + error */}
              <div className="flex items-center justify-between mb-4">
                <button onClick={handleSwap} className="flex items-center text-[13px] text-[#666] hover:text-black transition" style={{ gap: "4px", fontWeight: "500" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" /></svg>
                  Swap order
                </button>
                <button
                  onClick={() => { images.forEach((img) => img && URL.revokeObjectURL(img.url)); setImages([null, null]); setStep(STEPS.UPLOAD); setError(null); }}
                  className="text-[13px] text-[#595959] hover:text-black transition"
                  style={{ fontWeight: "400" }}
                >
                  Replace photos
                </button>
              </div>

              {error && <p style={{ fontWeight: "500", fontSize: "13px" }} className="text-red-500 mb-3">{error}</p>}

              <button
                onClick={handleGenerate}
                className="w-full py-3 rounded-xl text-black transition hover:opacity-80"
                style={{ background: "#FFD700", fontWeight: "600", fontSize: "15px" }}
              >
                Create Before & After
              </button>
            </div>
          )}

          {/* GENERATING STEP */}
          {step === STEPS.GENERATING && (
            <div className="flex flex-col items-center py-10">
              <div className="w-10 h-10 border-3 border-[#FFD700] border-t-transparent rounded-full animate-spin mb-4" style={{ borderWidth: "3px" }} />
              <p style={{ fontWeight: "500", fontSize: "15px" }} className="text-[#555]">Creating your collage...</p>
            </div>
          )}

          {/* RESULT STEP */}
          {step === STEPS.RESULT && resultUrl && (
            <div className="flex flex-col">
              <img src={resultUrl} alt="Before and After" className="w-full h-auto mb-4" style={{ borderRadius: "12px" }} />

              <button
                onClick={() => { handleDownload(); setTimeout(() => { setStep(STEPS.QUALIFY); logAnalytics("landing_qualification_shown"); }, 400); }}
                className="w-full py-3 rounded-xl text-black transition hover:opacity-80 mb-4"
                style={{ background: "#FFD700", fontWeight: "600", fontSize: "15px" }}
              >
                Download
              </button>

              {/* App CTA */}
              <div className="p-5 mb-2" style={{ background: "rgba(242,195,27,0.08)", borderRadius: "16px" }}>
                <p style={{ fontWeight: "600", fontSize: "16px", lineHeight: "1.4" }} className="text-black mb-1">Want to create these faster on every job?</p>
                <p style={{ fontWeight: "400", fontSize: "13px", lineHeight: "1.6" }} className="text-[#555] mb-4">Use ProofPix to capture before/after photos in order, match angles, organize projects, and share professional results.</p>
                <div className="flex" style={{ gap: "10px" }}>
                  <a
                    href="https://apps.apple.com/us/app/proofpix/id6754261444"
                    target="_blank" rel="noopener noreferrer"
                    onClick={() => logStoreClick({ store: "ios", location: "post_upload_modal" })}
                  >
                    <img src="/applestore.webp" alt="App Store" style={{ height: "40px" }} />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.proofpix.app"
                    target="_blank" rel="noopener noreferrer"
                    onClick={() => logStoreClick({ store: "android", location: "post_upload_modal" })}
                  >
                    <img src="/playstore.webp" alt="Google Play" style={{ height: "40px" }} />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* QUALIFICATION STEP */}
          {step === STEPS.QUALIFY && (
            <div className="flex flex-col">
              <p style={{ fontWeight: "600", fontSize: "16px" }} className="text-black mb-1">What do you use before/after photos for?</p>
              <p style={{ fontWeight: "400", fontSize: "13px" }} className="text-[#595959] mb-4">Help us make ProofPix better for you</p>
              <div className="flex flex-col" style={{ gap: "8px" }}>
                {["Cleaning", "Contracting", "Restoration", "Editing / Content", "Personal use", "Other"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleQualify(opt)}
                    className="w-full py-2.5 px-4 rounded-xl text-left transition hover:bg-[#f7f7f7]"
                    style={{ border: "1px solid rgba(0,0,0,0.1)", fontWeight: "500", fontSize: "14px" }}
                  >
                    {opt}
                  </button>
                ))}
                <button
                  onClick={() => { logAnalytics("landing_qualification_skipped"); handleClose(); }}
                  className="w-full py-2 text-center text-[13px] text-[#595959] hover:text-[#555] transition"
                  style={{ fontWeight: "400" }}
                >
                  Skip
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Hidden canvas for generation */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}

// Renders the "Try it instantly" panel (heading + phone mockup + Upload CTA + badges)
// plus the modal wiring. Returns inline content (no <section> wrapper) so it can be
// embedded directly inside the hero section.
function UploadToolSection() {
  const [showModal, setShowModal] = useState(false);
  const openTool = () => { setShowModal(true); logAnalytics("landing_upload_tool_opened"); };

  return (
    <>
      <div className="mx-auto w-full px-4 pt-3 sm:px-6 sm:pt-4">
        <div className="mx-auto flex flex-col items-center text-center" style={{ maxWidth: "600px" }}>

          {/* Phone frame with the real main-screen screenshot. Cut tight — under
              the first row of project photos in the screenshot — and both the
              "Try it instantly" headline and the Upload CTA float over the cut. */}
          <div
            className="relative"
            style={{ width: "clamp(280px, 42vw, 380px)" }}
          >
            <div
              className="relative"
              style={{
                borderTopLeftRadius: "2.5rem",
                borderTopRightRadius: "2.5rem",
                borderTop: "8px solid #262626",
                borderLeft: "8px solid #262626",
                borderRight: "8px solid #262626",
                borderBottom: "0",
                background: "#262626",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                overflow: "hidden",
              }}
            >
              {/* Notch */}
              <div
                className="absolute left-1/2 top-0 z-10 -translate-x-1/2"
                style={{ height: "22px", width: "108px", borderBottomLeftRadius: "12px", borderBottomRightRadius: "12px", background: "#262626" }}
              />
              {/* Screen — height tuned so the cut lands just under the first row
                  of photos in appscreenshot.webp (image native 386x840). */}
              <div
                className="relative bg-black overflow-hidden aspect-[9/11]"
                style={{
                  borderTopLeftRadius: "calc(2.5rem - 8px)",
                  borderTopRightRadius: "calc(2.5rem - 8px)",
                }}
              >
                <img
                  src="/appscreenshot.webp"
                  alt="ProofPix main screen"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ objectPosition: "50% 0%" }}
                  width="386"
                  height="472"
                  fetchpriority="high"
                  decoding="async"
                />
                {/* Bottom gradient hosts the headline + CTA legibly, regardless of
                    what the underlying screenshot pixels show. */}
                <div
                  className="absolute bottom-0 left-0 right-0"
                  style={{ height: "65%", background: "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.78))", pointerEvents: "none" }}
                />
                {/* Overlay group: "Try it instantly..." + supporting line + CTA */}
                <div
                  className="absolute left-0 right-0 flex flex-col items-center px-4"
                  style={{ bottom: "6%", gap: "10px", zIndex: 10 }}
                >
                  <h2
                    style={{ fontWeight: 700, letterSpacing: "-0.201242px", color: "#FFFFFF", textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
                    className="text-[18px] leading-[24px] sm:text-[20px] sm:leading-[26px]"
                  >
                    Try it instantly — no app required
                  </h2>
                  <button
                    onClick={openTool}
                    className="rounded-xl text-black transition hover:opacity-90"
                    style={{
                      padding: "12px 28px",
                      background: "#FFD700",
                      fontWeight: 600,
                      fontSize: "15px",
                      whiteSpace: "nowrap",
                      boxShadow: "0 10px 30px rgba(242,195,27,0.55), 0 2px 6px rgba(0,0,0,0.18)",
                    }}
                  >
                    Upload 2 Photos
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Supporting copy below the device. */}
          <p style={{ fontWeight: "300" }} className="text-[14px] lg:text-[16px] text-[#555] mt-5 mb-4">
            Already have 2 photos? Turn them into a branded before/after in seconds.
          </p>

          {/* Store buttons — moved here from the hero so they sit underneath the
              screenshot. Smaller on mobile, full-size on sm+. */}
          <div className="flex sm:hidden items-center justify-center" style={{ gap: "18px" }}>
            <a
              href="https://play.google.com/store/apps/details?id=com.proofpix.app"
              target="_blank" rel="noopener noreferrer"
              onClick={() => logStoreClick({ store: "android", location: "hero_under_phone" })}
              aria-label="Get ProofPix on Google Play"
            >
              <img src="/playstore.webp" alt="Google Play" width="150" height="49" style={{ width: "150px", height: "49px", borderRadius: "12px" }} />
            </a>
            <a
              href="https://apps.apple.com/us/app/proofpix/id6754261444"
              target="_blank" rel="noopener noreferrer"
              onClick={() => logStoreClick({ store: "ios", location: "hero_under_phone" })}
              aria-label="Download ProofPix on the App Store"
            >
              <img src="/applestore.webp" alt="Apple App Store" width="146" height="49" style={{ width: "146px", height: "49px", borderRadius: "12px" }} />
            </a>
          </div>
          <div className="hidden sm:flex items-center justify-center" style={{ gap: "21px" }}>
            <a
              href="https://play.google.com/store/apps/details?id=com.proofpix.app"
              target="_blank" rel="noopener noreferrer"
              onClick={() => logStoreClick({ store: "android", location: "hero_under_phone" })}
              aria-label="Get ProofPix on Google Play"
            >
              <img src="/playstore.webp" alt="Google Play" width="215" height="70" style={{ width: "215px", height: "70px", borderRadius: "19px" }} />
            </a>
            <a
              href="https://apps.apple.com/us/app/proofpix/id6754261444"
              target="_blank" rel="noopener noreferrer"
              onClick={() => logStoreClick({ store: "ios", location: "hero_under_phone" })}
              aria-label="Download ProofPix on the App Store"
            >
              <img src="/applestore.webp" alt="Apple App Store" width="208" height="69" style={{ width: "208px", height: "69px", borderRadius: "19px" }} />
            </a>
          </div>

          {/* Trust badges anchor the bottom */}
          <div className="flex items-center flex-wrap justify-center mt-5" style={{ gap: "16px" }}>
            <span style={{ fontWeight: "300", fontSize: "12px" }} className="text-[#595959]">No signup required</span>
            <span style={{ fontWeight: "300", fontSize: "12px" }} className="text-[#595959]">Watermark included</span>
            <span style={{ fontWeight: "300", fontSize: "12px" }} className="text-[#595959]">Works in browser</span>
          </div>
        </div>
      </div>

      {showModal && <UploadToolModal onClose={() => setShowModal(false)} />}
    </>
  );
}

export default UploadToolSection;
