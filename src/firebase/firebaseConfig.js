// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBg6BhGDKFSPSgz2KxwIMDd39ohDR6SB78",
    authDomain: "spil-cafe.firebaseapp.com",
    projectId: "spil-cafe",
    storageBucket: "spil-cafe.firebasestorage.app",
    messagingSenderId: "678520100739",
    appId: "1:678520100739:web:c84be9c5c78fabfe3148b6"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
