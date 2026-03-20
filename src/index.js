import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import AppV2 from "./AppV2";
import reportWebVitals from "./reportWebVitals";
import { remoteConfig, analytics, logEvent, fetchAndActivate, getValue } from "./firebase";

function ABRoot() {
  const [variant, setVariant] = useState(null);

  useEffect(() => {
    fetchAndActivate(remoteConfig)
      .then(() => {
        const v = getValue(remoteConfig, "landing_variant").asString();
        setVariant(v === "B" ? "B" : "A");
        logEvent(analytics, "ab_variant_assigned", { variant: v === "B" ? "B" : "A" });
      })
      .catch(() => {
        setVariant("A");
      });
  }, []);

  if (variant === null) return null; // brief blank while fetching (~100ms)
  return variant === "B" ? <AppV2 /> : <App />;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Direct access still works for testing */}
        <Route path="/v2" element={<AppV2 />} />
        {/* All other paths go through A/B split */}
        <Route path="*" element={<ABRoot />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
