import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDa2DiznfIrHQdTVCMINCVC4OmzdhVyifo",
  authDomain: "drive-o-meter.firebaseapp.com",
  projectId: "drive-o-meter",
  storageBucket: "drive-o-meter.firebasestorage.app",
  messagingSenderId: "601141764718",
  appId: "1:601141764718:web:65d7a370fb88c5e3987c7f",
  measurementId: "G-RTW9ELW69W"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
