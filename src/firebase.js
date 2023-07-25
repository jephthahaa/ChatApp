import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDNAx3reEBJIPL07-s5PHYbAngZb2ULr_Q",
  authDomain: "chatcalm-37ea7.firebaseapp.com",
  projectId: "chatcalm-37ea7",
  storageBucket: "chatcalm-37ea7.appspot.com",
  messagingSenderId: "324644822178",
  appId: "1:324644822178:web:bec9d43fe0eb83f5f24bfb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore();

export { app, auth, storage, db };

