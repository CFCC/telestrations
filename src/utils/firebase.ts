import * as firebase from "firebase/app";

import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";
import DocumentReference = firebase.firestore.DocumentReference;
import {Game, Notepad, Player} from "../types/firebase";
import CollectionReference = firebase.firestore.CollectionReference;

firebase.initializeApp({
    apiKey: "AIzaSyArJkOYiJZ0Ur_BJ67mgERDtDtA8RehFqo",
    authDomain: "telestrations-3aa19.firebaseapp.com",
    databaseURL: "https://telestrations-3aa19.firebaseio.com",
    projectId: "telestrations-3aa19",
    storageBucket: "telestrations-3aa19.appspot.com",
    messagingSenderId: "751293854725",
    appId: "1:751293854725:web:1f057bd8b910b9b6e8d86c",
    measurementId: "G-GVT95G6SSL"
});

export const playerRef = (gameCode: string, playerId: string): DocumentReference<Player> => firebase
    .firestore()
    .doc(`games/${gameCode}/players/${playerId}`);

export const playerListRef = (gameCode: string): CollectionReference<Player> => firebase
    .firestore()
    .collection(`games/${gameCode}/players`);

export const notebookRef = (gameCode: string, notepadId: string): DocumentReference<Notepad> => firebase
    .firestore()
    .doc(`games/${gameCode}/notepad/${notepadId}`);

export const notebookListRef = (gameCode: string): CollectionReference<Notepad> => firebase
    .firestore()
    .collection(`games/${gameCode}/notepad`);

export const gameRef = (gameCode: string): DocumentReference<Game> => firebase
    .firestore()
    .doc(`games/${gameCode}}`);
