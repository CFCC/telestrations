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

    let {displayName, uid} = user;
    if (!user.displayName) {
        displayName = _.startCase(uniqueNamesGenerator({
            dictionaries: [colors, animals],
            length: 2,
            separator: "-",
        }));
        user.updateProfile({displayName});
    }

    store.dispatch(setUser({uid, displayName}));
});

export const firebaseLoginUi = new firebaseUi.auth.AuthUI(firebase.auth());
export const signInOptions = [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    firebaseUi.auth.AnonymousAuthProvider.PROVIDER_ID
];

export type User = Pick<firebase.User, "uid" | "displayName">;
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

export const getImageURL = async (image: string): Promise<string> => {
    return await firebase.storage().ref(image).getDownloadURL() as string;
};
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
    const game = firebase.firestore().doc(`games/${gameCode}`) as DocumentReference<Partial<Game>>;

    game.onSnapshot(snapshot => {
        const newGame = snapshot.data();
        if (!newGame) return;

        if (isClient) {
            if (newGame.status === "in progress") store.dispatch(setGameState(GameState.IN_GAME));
            else if (newGame.status === "finished") store.dispatch(setGameState(GameState.FINISHED));
        }

        store.dispatch(updateGame({...newGame, id: snapshot.id}));
    });
    game.collection("notepads").onSnapshot(snapshot => {
        const notepads = _.mapValues(_.keyBy(snapshot.docs, "id"), d => d.data() as Notepad);
        store.dispatch(updateNotepads(notepads));
    });
    game.collection("players").onSnapshot(async snapshot => {
        const players = _.mapValues(_.keyBy(snapshot.docs, "id"), d => d.data() as Player);
        store.dispatch(updatePlayers(players));

        if (!isClient) {
            const {notepads, game: {status}} = store.getState().firebase;
            const gameIsOver =
                status === "in progress" &&
                Object.entries(players).every(([pid, p]) => notepads[p.currentNotepad]?.ownerId === pid) &&
                Object.values(notepads).every(n => n.pages.length > 1);

            if (gameIsOver) game.set({status: "finished"}, {merge: true});
        } else {
            const {uid} = store.getState().client.user;
            const {currentNotepad, queue} = players[uid];

            if (!currentNotepad && queue.length > 0) {
                const newQueue = [...queue];
                const newNotepad = newQueue.shift();

                await (firebase
                    .firestore()
                    .doc(`games/${gameCode}/players/${uid}`) as DocumentReference<Partial<Player>>)
                    .set({queue: newQueue, currentNotepad: newNotepad}, {merge: true})
            }
        }
    });
};
export const createGame = async (gameCode: string) => {
    const {client: {user}} = store.getState();

    await (firebase
        .firestore()
        .doc(`games/${gameCode}`) as DocumentReference<Game>)
        .set({
            created: new Date().getTime(),
            status: "lobby",
            serverId: user.uid,
        } as Game);
};
export const joinGame = async (gameCode: string) => {
    const {client: {user}} = store.getState();

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
            .doc(`games/${gameCode}/notepads/${notepadId}`) as DocumentReference<Notepad>)
            .set({ownerId: playerId, pages: []});
        await (firebase
            .firestore()
            .doc(`games/${gameCode}/players/${playerId}`) as DocumentReference<Partial<Player>>)
            .set({
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
const updateGuessInFirebase = _.throttle(async (guess: string) => {
    const {
        client: {user},
        firebase: {
            game: {id: gameCode},
            players,
            notepads,
        },
    } = store.getState();
    const currentNotepadId = players[user.uid].currentNotepad;
    const currentNotepad = notepads[currentNotepadId];
    if (!currentNotepad) return;

    const pages = _.cloneDeep(currentNotepad.pages);
    const needsNewPage = _.last(pages)?.author !== user.uid;
    if (needsNewPage) {
        pages.push({
            author: user.uid,
            lastUpdated: new Date().getTime(),
            content: "",
        });
    }

    if (pages.length % 2 === 1) {
        pages[pages.length - 1].content = guess;
        pages[pages.length - 1].lastUpdated = new Date().getTime();
    } else {
        let fileName = _.last(pages)?.content;
        if (!fileName) {
            fileName = `${uuid()}.png`;
            pages[pages.length - 1].content = fileName;
        }

        pages[pages.length - 1].lastUpdated = new Date().getTime();
        firebase
            .storage()
            .ref()
            .child(fileName)
            .putString(guess, "data_url");
    }

    await (firebase
        .firestore()
        .doc(`games/${gameCode}/notepads/${currentNotepadId}`) as DocumentReference<Partial<Notepad>>)
        .set({pages}, {merge: true});
}, 500);
export const setGuess = (guess: string) => updateGuessInFirebase(guess);
export const submitGuess = async () => {
    const {client: {user}, firebase: {game: {id: gameCode}, players}} = store.getState();
    const {currentNotepad, nextPlayer} = players[user.uid];
    const {queue: nextPlayerQueue} = players[nextPlayer];

    await (firebase
        .firestore()
        .doc(`games/${gameCode}/players/${nextPlayer}`) as DocumentReference<Partial<Player>>)
        .set({queue: [...nextPlayerQueue, currentNotepad]}, {merge: true});
    await (firebase
        .firestore()
        .doc(`games/${gameCode}/players/${user.uid}`) as DocumentReference<Partial<Player>>)
        .set({currentNotepad: ""}, {merge: true});
};
