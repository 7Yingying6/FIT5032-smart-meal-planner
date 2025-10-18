// src/uploadRecipes.js
// Upload all recipes from recipes.json to Firestore

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import fs from "fs";

// Read local JSON file
const recipes = JSON.parse(fs.readFileSync("./src/recipes.json", "utf-8"));


// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfYI7286H51B6M68XgWAVCpl-5MXy2h4M",
  authDomain: "week7-yingying-ren.firebaseapp.com",
  projectId: "week7-yingying-ren",
  storageBucket: "week7-yingying-ren.firebasestorage.app",
  messagingSenderId: "783966259650",
  appId: "1:783966259650:web:4b049561e5d36284cb2e5b",
  measurementId: "G-1G1EN5MRLQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Upload recipes
async function uploadRecipes() {
  for (const recipe of recipes) {
    try {
      await addDoc(collection(db, "recipes"), recipe);
      console.log(` Uploaded: ${recipe.name}`);
    } catch (error) {
      console.error(" Upload failed:", error);
    }
  }
  console.log(" All recipes have been uploaded successfully!");
}

uploadRecipes();
