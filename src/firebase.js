// Firebase configuration used by the app

import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

for (const [key, value] of Object.entries(firebaseConfig)) {
  if (!value) {
    console.error(`Missing Firebase env: ${key}`);
  }
}

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
  // Enable auto detection of long polling in dev environments
  experimentalAutoDetectLongPolling: true,
  // useFetchStreams should be false to avoid stream issues under certain proxies
  useFetchStreams: false,
  ignoreUndefinedProperties: true,
});

export { db };
export default app;
