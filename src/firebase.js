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

const missingKeys = Object.entries(firebaseConfig)
  .filter(([key, value]) => !value)
  .map(([key]) => key)

if (missingKeys.length && import.meta.env.DEV) {
  console.debug(`Missing Firebase env keys: ${missingKeys.join(', ')}`)
}

// Flag to indicate whether Firebase config is valid
const hasValidConfig = missingKeys.length === 0

// Initialize app only when config is valid
const app = hasValidConfig ? initializeApp(firebaseConfig) : null

// Initialize Firestore only in production with valid config
const db = hasValidConfig && import.meta.env.PROD ? initializeFirestore(app, {
  // Force long polling to avoid Listen/channel aborts in certain dev environments
  experimentalForceLongPolling: true,
  // Prefer REST transport to avoid streaming Listen/channel requests in dev
  preferRest: true,
  // useFetchStreams should be false to avoid stream issues under certain proxies
  useFetchStreams: false,
  ignoreUndefinedProperties: true,
}) : null

export { db, hasValidConfig }
export default app
