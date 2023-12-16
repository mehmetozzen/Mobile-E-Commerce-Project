import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBOjKpPRyzW-SP8O6F4l9PtobsCvEirjKA",
    authDomain: "mobil-odev-ce326.firebaseapp.com",
    projectId: "mobil-odev-ce326",
    storageBucket: "mobil-odev-ce326.appspot.com",
    messagingSenderId: "398547736521",
    appId: "1:398547736521:web:37c506ade3c0d0c4a33a18",
    measurementId: "G-YZZYFYCG4R"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const firestore = getFirestore(app)