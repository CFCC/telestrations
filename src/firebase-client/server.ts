import firebase from 'firebase/app';
import {Game} from "../types/firebase";

let gameCode: string;
export function addGameToLobby(code: string, serverId: string) {
    gameCode = code;
    firebase
        .firestore()
        .doc(`games/${code}`)
        .set({created: Date.now(), state: 'lobby', serverId});
}

export function startGame() {
    firebase
        .firestore()
        .doc(`games/${gameCode}`)
        .set({state: 'in progress'}, {merge: true});
}

let cleanUpFn: () => void;
export function endGame() {
    firebase
        .firestore()
        .doc(`games/${gameCode}`)
        .set({state: 'finished'}, {merge: true});
    cleanUpFn();
}

export function listenForGame(callback: (game: Game) => void) {
    cleanUpFn = firebase
        .firestore()
        .doc(`games/${gameCode}`)
        .onSnapshot(async snapshot => {
            const game = snapshot.data() as Game;
            callback(game);
        });
}
