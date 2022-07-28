import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAfqW3FzD1cOo8GMBjIhjM8IGqmb3UjFOA",
  authDomain: "myaccommodation-f2a3c.firebaseapp.com",
  projectId: "myaccommodation-f2a3c",
  storageBucket: "myaccommodation-f2a3c.appspot.com",
  messagingSenderId: "509469687333",
  appId: "1:509469687333:web:51c157eac67b85403cc9cc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore()