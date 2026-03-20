import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

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

export { app, analytics };
