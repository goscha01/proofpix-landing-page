// True when the page is being rendered inside react-snap's headless Chromium
// so we can skip work (setInterval carousels, etc.) that would otherwise mutate
// state and cause a hydration mismatch (React error #418) once a real browser
// loads the snapshot.
//
// react-snap uses Puppeteer 1.x, which does NOT hide `navigator.webdriver`, so
// this is `true` in the crawler and `false` in a normal user browser.
export const isSnap =
  typeof navigator !== "undefined" &&
  (navigator.webdriver === true || /HeadlessChrome/i.test(navigator.userAgent || ""));
