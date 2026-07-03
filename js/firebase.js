// ============================================
// Subly - Firebase Configuration
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuS3tAf5QFQNpWvBj7KqUx93tYG267Sxs",
  authDomain: "subly-e0350.firebaseapp.com",
  projectId: "subly-e0350",
  storageBucket: "subly-e0350.firebasestorage.app",
  messagingSenderId: "149985570488",
  appId: "1:149985570488:web:52b6c3f962470635544e4d",
  measurementId: "G-CXZ4DCCGR3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Analytics (يعمل فقط داخل المتصفح)
let analytics = null;

if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Export Services
export {
  app,
  auth,
  db,
  storage,
  analytics
};

console.log("✅ Firebase initialized successfully");