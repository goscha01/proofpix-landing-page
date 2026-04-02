import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import AppV2 from "./AppV2";
import AppV3 from "./AppV3";
import Privacy from "./Privacy";
import Terms from "./Terms";
import DataDeletion from "./DataDeletion";
import reportWebVitals from "./reportWebVitals";
import { remoteConfig, analytics, logEvent, fetchAndActivate, getValue } from "./firebase";

const VARIANTS = { A: App, B: AppV2, C: AppV3 };

function ABRoot() {
  const [variant, setVariant] = useState("A"); // Render immediately with default

  useEffect(() => {
    fetchAndActivate(remoteConfig)
      .then(() => {
        const v = getValue(remoteConfig, "landing_variant").asString();
        if (["A", "B", "C"].includes(v)) setVariant(v);
        logEvent(analytics, "ab_variant_assigned", { variant: v });
      })
      .catch(() => {});
  }, []);

  const Component = VARIANTS[variant] || App;
  return <Component />;
}

const appTree = (
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Legal pages */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/data-deletion" element={<DataDeletion />} />
        {/* Direct access still works for testing */}
        <Route path="/v2" element={<AppV2 />} />
        <Route path="/v3" element={<AppV3 />} />
        {/* All other paths go through A/B split */}
        <Route path="*" element={<ABRoot />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

const rootElement = document.getElementById("root");

// react-snap pre-renders to static HTML; hydrate if content already exists
if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, appTree);
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(appTree);
}

reportWebVitals();
