// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXvI_npk1UTE8h--ZL3IjTvV1MUab-e-M",
  authDomain: "photofolio-cn-93b96.firebaseapp.com",
  projectId: "photofolio-cn-93b96",
  storageBucket: "photofolio-cn-93b96.firebasestorage.app",
  messagingSenderId: "342966006438",
  appId: "1:342966006438:web:ee75b8099bf7ed357e3a67"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);