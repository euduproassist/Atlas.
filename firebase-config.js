import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyDDIE2VrOGza-cBUMJGV07qiSav516_x1w",
  authDomain: "atlas-apply-e8e38.firebaseapp.com",
  projectId: "atlas-apply-e8e38",
  storageBucket: "atlas-apply-e8e38.firebasestorage.app",
  messagingSenderId: "94463036488",
  appId: "1:94463036488:web:fc8b44f6431eb442ca1c7d",
  measurementId: "G-P33NJYDEJ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services to be exported
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
