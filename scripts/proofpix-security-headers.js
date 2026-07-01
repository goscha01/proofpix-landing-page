function handler(event) {
  var r = event.response;
  var h = r.headers;
  // --- existing strengthened headers (layered on top of managed Security policy) ---
  h['strict-transport-security'] = { value: 'max-age=63072000; includeSubDomains' };
  h['x-frame-options'] = { value: 'DENY' };
  h['permissions-policy'] = { value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=(), midi=(), interest-cohort=()' };
  h['cross-origin-opener-policy'] = { value: 'same-origin' };
  h['cross-origin-resource-policy'] = { value: 'same-origin' };

  // --- Content-Security-Policy in Report-Only mode ---
  // Allowlists tuned for what the bundle actually loads:
  //   Firebase Analytics + Remote Config + Installations  → firebaseinstallations / firebaseremoteconfig.googleapis.com, *.firebaseio.com, *.firebaseapp.com, www.gstatic.com (firebase JS SDK chunks load from gstatic in dev — SDK's Remote Config sometimes does)
  //   Google Analytics gtag                                → www.googletagmanager.com, www.google-analytics.com, region1.google-analytics.com, *.analytics.google.com
  //   Google Fonts                                         → fonts.googleapis.com (CSS), fonts.gstatic.com (woff2)
  //   Proxy referral landing                               → steadfast-blessing-production.up.railway.app
  //   Inline canvas/blob preview generation                → blob:, data: for img-src
  // 'unsafe-inline' is required because CRA inlines small style chunks; revisit
  // once we move to nonces/hashes. Report-Only first so we can watch for breakage
  // before flipping to enforced Content-Security-Policy.
  //
  // NOTE: `upgrade-insecure-requests` is intentionally omitted here — browsers
  // ignore it in report-only mode (it's an active enforcement directive, not a
  // policy that can be "reported"). Add it back when we flip this header to
  // enforced `content-security-policy`. Lighthouse was logging a console
  // warning for the ignored directive.
  var csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://*.firebaseio.com https://*.firebaseapp.com https://www.gstatic.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://*.firebaseio.com wss://*.firebaseio.com https://*.firebaseapp.com https://www.googleapis.com https://firebase.googleapis.com https://firebaseinstallations.googleapis.com https://firebaseremoteconfig.googleapis.com https://www.google-analytics.com https://*.analytics.google.com https://region1.google-analytics.com https://fonts.googleapis.com https://fonts.gstatic.com https://steadfast-blessing-production.up.railway.app",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'"
  ].join('; ');
  h['content-security-policy-report-only'] = { value: csp };

  return r;
}
