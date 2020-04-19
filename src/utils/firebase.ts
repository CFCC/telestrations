import * as firebase from "firebase/app";

import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";

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

type DocumentReference<T> = firebase.firestore.DocumentReference<T>;
type CollectionReference<T> = firebase.firestore.CollectionReference<T>;

export type WithId<T extends {}> = T & {
    id: string;
}

export interface Page {
    content: string;
    lastUpdated: number;
    author: string;
}

export interface Notepad {
    ownerId: string;
    pages: Page[];
}

export interface Player {
    currentNotepad: string;
    nextPlayer: string;
    name: string;
    queue: string[];
}

export interface Game {
    created: number;
    status: "lobby" | "in progress" | "finished";
    serverId: string;
}

export const playerRef = (gameCode: string, playerId: string): DocumentReference<Partial<Player>> => firebase
    .firestore()
    .doc(`games/${gameCode}/players/${playerId}`) as DocumentReference<Player>;

export const playerListRef = (gameCode: string): CollectionReference<Player> => firebase
    .firestore()
    .collection(`games/${gameCode}/players`) as CollectionReference<Player>;

export const notebookRef = (gameCode: string, notepadId: string): DocumentReference<Partial<Notepad>> => firebase
    .firestore()
    .doc(`games/${gameCode}/notepad/${notepadId}`) as DocumentReference<Notepad>;

export const notebookListRef = (gameCode: string): CollectionReference<Notepad> => firebase
    .firestore()
    .collection(`games/${gameCode}/notepad`) as CollectionReference<Notepad>;

export const gameListRef = (): CollectionReference<Game> => firebase
    .firestore()
    .collection("games") as CollectionReference<Game>;

export const gameRef = (gameCode: string): DocumentReference<Partial<Game>> => firebase
    .firestore()
    .doc(`games/${gameCode}}`) as DocumentReference<Game>;

export const storageRef = (fileName: string) => firebase
    .storage()
    .ref()
    .child(fileName);
