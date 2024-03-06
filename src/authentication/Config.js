//Config.js

import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBSDA8VCzJMdNYTGTaQ4CDRtBVu2Smczsw",
    authDomain: "bruin-market.firebaseapp.com",
    projectId: "bruin-market",
    storageBucket: "bruin-market.appspot.com",
    messagingSenderId: "1043530359859",
    appId: "1:1043530359859:web:817ade38dc82081000ef46",
    measurementId: "G-RTDYYC5LJH"
  };

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);