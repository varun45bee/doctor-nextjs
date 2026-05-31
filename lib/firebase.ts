import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCoI56cR9GMyHIqDBRxUnUZyo0mmMSPG1k",
  authDomain: "doc-web-a913f.firebaseapp.com",
  projectId: "doc-web-a913f",
  storageBucket: "doc-web-a913f.firebasestorage.app",
  messagingSenderId: "772213810505",
  appId: "1:772213810505:web:c0c033f7c5be102d806698",
  measurementId: "G-L6W3H8QCDQ",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
const db = getFirestore(app);

let analytics: Analytics | null = null;

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) analytics = getAnalytics(app);
  });
}

export { app, auth, db, analytics };
