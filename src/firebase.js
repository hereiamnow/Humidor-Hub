/**
 *
 * @file firebase.js
 * @path src/firebase.js
 * @project Humidor Hub
 * @author Shawn Miller (hereiamnow@gmail.com)
 * @date July 3, 2025
 *
 * Firebase Initialization Module
 *
 * Initializes and exports the Firebase app, Firestore database, and Auth instances for the Humidor Hub app. Provides the configuration object for use throughout the application. Ensures all Firebase services are set up with the correct project credentials.
 *
 */

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// This configuration object is used to initialize Firebase.
// Ensure that the keys and identifiers are correct and match your Firebase project settings.
const firebaseConfig = {
  apiKey: "AIzaSyCh0cvqGXCSkcAjPQpn-DeVCEySrmrHETw",
  authDomain: "humidor-hub.firebaseapp.com",
  projectId: "humidor-hub",
  storageBucket: "humidor-hub.firebasestorage.app",
  messagingSenderId: "818153362018",
  appId: "1:818153362018:web:68fccfbb8e45078dd7b73b"
};

// Initialize Firebase using the correct 'firebaseConfig' variable
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
// These exports can be used in other parts of your application to interact with Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);
export const firebaseConfigExport = firebaseConfig; // This line is fine and can stay