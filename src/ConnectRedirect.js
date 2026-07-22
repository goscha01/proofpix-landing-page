import React, { useEffect, useState } from "react";

const IOS_STORE = "https://apps.apple.com/us/app/proofpix-before-after/id6754261444";
const ANDROID_STORE = "https://play.google.com/store/apps/details?id=com.proofpix.app";

export default function ConnectRedirect() {
  const [showStores, setShowStores] = useState(false);
  const [missing, setMissing] = useState(false);
  const [token, setToken] = useState("");
  const [workspace, setWorkspace] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token") || "";
    const w = params.get("workspace") || "";
    setToken(t);
    setWorkspace(w);
    if (!t || !w) {
      setMissing(true);
      setShowStores(true);
      return;
    }
    const schemeUrl =
      "proofpix://connect?token=" +
      encodeURIComponent(t) +
      "&workspace=" +
      encodeURIComponent(w);
    window.location.href = schemeUrl;
    const timer = setTimeout(() => setShowStores(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const schemeUrl =
    token && workspace
      ? "proofpix://connect?token=" +
        encodeURIComponent(token) +
        "&workspace=" +
        encodeURIComponent(workspace)
      : "#";

  return (
    <div style={styles.body}>
      <div style={styles.card}>
        <h1 style={styles.h1}>Connecting Service Flow</h1>
        {missing ? (
          <div style={styles.error}>
            This pairing link is missing required information. Return to Service Flow and start the connect flow again.
          </div>
        ) : (
          <>
            <p style={styles.p}>Opening ProofPix to complete pairing…</p>
            <div style={styles.spinner} />
            <a style={styles.btn} href={schemeUrl}>Open in ProofPix</a>
          </>
        )}
        {showStores && (
          <div style={styles.stores}>
            <p style={{ marginBottom: 8, fontSize: 14 }}>Don't have ProofPix yet?</p>
            <a style={{ ...styles.storeBtn, background: "#007AFF" }} href={IOS_STORE}>Download for iPhone</a>
            <a style={{ ...styles.storeBtn, background: "#34A853" }} href={ANDROID_STORE}>Download for Android</a>
          </div>
        )}
        <p style={styles.hint}>Pairing tokens expire after 60 seconds. If nothing happens, request a new one from Service Flow.</p>
      </div>
      <style>{`@keyframes ppspin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const styles = {
  body: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    background: "linear-gradient(135deg, #F2C31B 0%, #E5B517 100%)",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    background: "white",
    borderRadius: 20,
    padding: "40px 32px",
    maxWidth: 400,
    width: "100%",
    textAlign: "center",
    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
    boxSizing: "border-box",
  },
  h1: { fontSize: 24, color: "#000", marginBottom: 8, margin: 0 },
  p: { fontSize: 16, color: "#666", marginBottom: 24, lineHeight: 1.5 },
  spinner: {
    width: 40,
    height: 40,
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #F2C31B",
    borderRadius: "50%",
    animation: "ppspin 1s linear infinite",
    margin: "20px auto",
  },
  btn: {
    display: "inline-block",
    background: "#F2C31B",
    color: "#000",
    fontWeight: 700,
    fontSize: 18,
    padding: "14px 32px",
    borderRadius: 100,
    textDecoration: "none",
    marginBottom: 12,
    width: "100%",
    boxSizing: "border-box",
  },
  stores: { marginTop: 24, display: "flex", flexDirection: "column", gap: 12 },
  storeBtn: {
    display: "block",
    padding: "14px 24px",
    color: "white",
    textDecoration: "none",
    borderRadius: 12,
    fontWeight: 600,
    fontSize: 16,
  },
  error: {
    background: "#FEE",
    color: "#C33",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 16,
  },
  hint: { fontSize: 13, color: "#999", marginTop: 16 },
};
