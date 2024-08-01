import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-be8b4.firebaseapp.com",
  projectId: "reactchat-be8b4",
  storageBucket: "reactchat-be8b4.appspot.com",
  messagingSenderId: "931391237400",
  appId: "1:931391237400:web:1b2f4f79980976c803826d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
