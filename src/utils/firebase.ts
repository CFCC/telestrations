import * as firebase from "firebase/app";
import _ from "lodash";
import {v4 as uuid} from "uuid";
import {animals, colors, uniqueNamesGenerator} from "unique-names-generator";
import * as firebaseUi from "firebaseui";

import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";

import {GameState, store, firebaseSlice, clientSlice} from "./store";
const {actions: {updatePlayers, updateNotepads, updateGame}} = firebaseSlice;
const {actions: {setGameState, setUser}} = clientSlice;

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
firebase.auth().onAuthStateChanged(function(user: firebase.User | null) {
    if (!user) return;
    if (!user.displayName) {
        const displayName = _.startCase(uniqueNamesGenerator({
            dictionaries: [colors, animals],
            length: 2,
            separator: "-",
        }));
        user.updateProfile({displayName});
        store.dispatch(setUser({...user, displayName}));
    } else {
        store.dispatch(setUser(user));
    }
});

export const firebaseLoginUi = new firebaseUi.auth.AuthUI(firebase.auth());

type DocumentReference<T> = firebase.firestore.DocumentReference<T>;
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

export const getGameCodes = (callback: (ids: string[]) => void) => {
    firebase
        .firestore()
        .collection("games")
        .where("status", "==", "lobby")
        .onSnapshot(async function(snapshot) {
            const newGames = snapshot.docs.map(doc => doc.id);
            callback(newGames);
        });
}
export const setGameCode = (gameCode: string, isClient: boolean = false) => {
    const game = firebase
        .firestore()
        .doc(`games/${gameCode}`) as DocumentReference<Partial<Game>>;
    game.onSnapshot(snapshot => {
        const newGame = snapshot.data() as Game;

        if (isClient) {
            if (newGame.status === "in progress") store.dispatch(setGameState(GameState.IN_GAME));
            else if (newGame.status === "finished") store.dispatch(setGameState(GameState.FINISHED));
        }

        if (newGame) updateGame(newGame);
    });
    game.collection("notepads").onSnapshot(snapshot => {
        const notepads = _.mapValues(_.keyBy(snapshot.docs, "id"), d => d.data() as Notepad);
        store.dispatch(updateNotepads(notepads));
    });
    game.collection("players").onSnapshot(snapshot => {
        const players = _.mapValues(_.keyBy(snapshot.docs, "id"), d => d.data() as Player);
        store.dispatch(updatePlayers(players));

        if (!isClient) {
            const notepads = store.getState().firebase.notepads;
            const gameIsOver = Object
                .entries(players)
                .every(([pid, p]) => notepads[p.currentNotepad].ownerId === pid);

            if (gameIsOver) game.set({status: "finished"}, {merge: true});
        }
    });
};
export const createGame = async (gameCode: string) => {
    await (firebase
        .firestore()
        .doc(`games/${gameCode}`) as DocumentReference<Game>).set({
        created: new Date().getTime(),
        status: "lobby",
        serverId: localStorage.getItem('serverId') ?? '',
    } as Game);
};
export const joinGame = async (gameCode: string) => {
    const {client: {user}} = store.getState();
    if (!user) return;

    await (firebase
        .firestore()
        .doc(`games/${gameCode}/players/${(user.uid)}`) as DocumentReference<Partial<Player>>)
        .set({name: user.displayName as NonNullable<string>});
};
export const startGame = async () => {
    const {firebase: {game: {id: gameCode}, players}} = store.getState();
    const playerIds = Object.keys(players);

    await Promise.all(playerIds.map(async (playerId, i) => {
        const notepadId = uuid();
        await (firebase
            .firestore()
            .doc(`games/${gameCode}/notepad/${notepadId}`) as DocumentReference<Notepad>).set({ownerId: playerId, pages: []});
        await (firebase
            .firestore()
            .doc(`games/${gameCode}/players/${playerId}`) as DocumentReference<Partial<Player>>).set({
                currentNotepad: notepadId,
                nextPlayer: playerIds[(i + 1) % playerIds.length],
                queue: [],
            }, {merge: true});
    }));
    await (firebase
        .firestore()
        .doc(`games/${gameCode}`) as DocumentReference<Partial<Game>>)
        .set({status: "in progress"}, {merge: true});
};
export const setGuess = async (guess: string) => {
    const {
        client: {user},
        firebase: {
            game: {id: gameCode},
            players,
            notepads,
        },
    } = store.getState();

    if (!user) return;
    const notepad = players[user.uid].currentNotepad;
    const currentNotepad = notepads[notepad];

    _.debounce(async () => {
        if (!currentNotepad) return;

        const pages = _.clone(currentNotepad.pages);
        const needsNewPage = _.last(pages)?.author === user.uid;
        if (needsNewPage) {
            pages.push({
                author: user.uid,
                lastUpdated: new Date().getTime(),
                content: "",
            });
        }

        if (pages.length % 2 === 0) {
            pages[pages.length - 1].content = guess;
        } else {
            let fileName = _.last(pages)?.content;
            if (!fileName) {
                fileName = `${uuid()}.png`;
                pages[pages.length - 1].content = fileName
            }

            firebase
                .storage()
                .ref()
                .child(fileName).putString(guess, "data_url");
        }

        const player = (await (firebase
            .firestore()
            .doc(`games/${gameCode}/players/${(user.uid)}`) as DocumentReference<Player>)
            .get())
            .data() as Player;
        await (firebase
            .firestore()
            .doc(`games/${gameCode}/notepad/${(player.currentNotepad)}`) as DocumentReference<Partial<Notepad>>)
            .set({pages}, {merge: true});
    }, 1000);
};
export const submitGuess = async () => {
    const {client: {user}, firebase: {game: {id: gameCode}}} = store.getState();
    if (!user) return;

    const currentPlayerRef = firebase
        .firestore()
        .doc(`games/${gameCode}/players/${(user.uid)}`) as DocumentReference<Player>;
    const {currentNotepad, nextPlayer} = (await currentPlayerRef.get()).data() as Player;

    const nextPlayerRef = firebase
        .firestore()
        .doc(`games/${gameCode}/players/${nextPlayer}`) as DocumentReference<Partial<Player>>;
    const {queue: nextPlayerQueue} = (await nextPlayerRef.get()).data() as Player;

    await nextPlayerRef.set({queue: [...nextPlayerQueue, currentNotepad]}, {merge: true});
};
