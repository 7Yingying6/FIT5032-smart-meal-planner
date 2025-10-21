// src/addMissingFields.js
// This script checks each recipe in Firestore and adds "ingredients" and "instructions"
// ONLY if they are missing.

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

//  Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyCfYI7286H51B6M68XgWAVCpl-5MXy2h4M",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "week7-yingying-ren.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "week7-yingying-ren",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "week7-yingying-ren.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "783966259650",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:783966259650:web:4b049561e5d36284cb2e5b",
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || "G-1G1EN5MRLQ",
};

//  Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addMissingFields() {
  const querySnapshot = await getDocs(collection(db, "recipes"));
  let updatedCount = 0;

  for (const d of querySnapshot.docs) {
    const data = d.data();
    const updates = {};

    // only add ingredients if missing or empty
    if (!data.ingredients || data.ingredients.length === 0) {
      updates.ingredients = [
        "1 tbsp olive oil",
        "200g main ingredient",
        "Salt and pepper to taste",
        "Optional garnish",
      ];
    }

    // only add instructions if missing or empty
    if (!data.instructions || data.instructions.length === 0) {
      updates.instructions = [
        "Prepare all ingredients.",
        "Heat oil in pan.",
        "Cook main ingredient until done.",
        "Season and serve.",
      ];
    }

    // Update only if something is missing
    if (Object.keys(updates).length > 0) {
      await updateDoc(doc(db, "recipes", d.id), updates);
      updatedCount++;
      console.log(` Updated: ${data.name}`);
    }
  }

  console.log(` Completed! ${updatedCount} recipe(s) were missing details and updated.`);
}

addMissingFields();
