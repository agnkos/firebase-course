import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBnA2Nljw9cqEiT8tfKoK_zvLZ5qvtRB28",
    authDomain: "fir-course-20a56.firebaseapp.com",
    projectId: "fir-course-20a56",
    storageBucket: "fir-course-20a56.appspot.com",
    messagingSenderId: "135485104094",
    appId: "1:135485104094:web:f1da63c50f14efa3d4074f",
    measurementId: "G-S1KFLBM1QH"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);