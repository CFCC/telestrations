import * as firebase from "firebase/app";

import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";

firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "telestrations-3aa19.firebaseapp.com",
    databaseURL: "https://telestrations-3aa19.firebaseio.com",
    projectId: "telestrations-3aa19",
    storageBucket: "telestrations-3aa19.appspot.com",
    messagingSenderId: "751293854725",
    appId: "1:751293854725:web:1f057bd8b910b9b6e8d86c",
    measurementId: "G-GVT95G6SSL"
});
