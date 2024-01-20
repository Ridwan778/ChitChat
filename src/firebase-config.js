// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_fUGxSRaSQVAlJX8pI8sOwMGvU47kc4k",
  authDomain: "chitchat-e8181.firebaseapp.com",
  projectId: "chitchat-e8181",
  storageBucket: "chitchat-e8181.appspot.com",
  messagingSenderId: "606122015484",
  appId: "1:606122015484:web:0f9ac8cbc77ebd0dfd3579"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app)
