import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getRemoteConfig, fetchAndActivate, getValue } from "firebase/remote-config";

const firebaseConfig = {
  apiKey: "AIzaSyADlAgGiheGYK4M3-NZe4Juv312h7J2UEM",
  authDomain: "proofpix-475818.firebaseapp.com",
  projectId: "proofpix-475818",
  storageBucket: "proofpix-475818.firebasestorage.app",
  messagingSenderId: "366423185",
  appId: "1:366423185:web:19326ae4832fa2c203a330",
  measurementId: "G-XK12REZ6MV",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const remoteConfig = getRemoteConfig(app);

// Default: show variant A. Fetch fresh config every 60s in dev, 12h in prod.
remoteConfig.defaultConfig = { landing_variant: "A" };
remoteConfig.settings.minimumFetchIntervalMillis =
  process.env.NODE_ENV === "development" ? 60000 : 43200000;

export { app, analytics, remoteConfig, logEvent, fetchAndActivate, getValue };
