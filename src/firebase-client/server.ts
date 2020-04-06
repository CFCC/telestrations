import firebase from 'firebase/app';
import _ from "lodash";

import {Game, Notepad, Player} from "../types/firebase";

let gameCode: string;
export function addGameToLobby(code: string, serverId: string) {
    gameCode = code;
    firebase
        .firestore()
        .doc(`games/${code}`)
        .set({
            created: Date.now(),
            status: 'lobby',
            serverId,
        });
}

export function startGame() {
    firebase
        .firestore()
        .doc(`games/${gameCode}`)
        .set({status: 'in progress'}, {merge: true});
}

let cleanUpPlayers: () => void;
let cleanUpNotepads: () => void;
let cleanUpGame: () => void;
export function endGame() {
    firebase
        .firestore()
        .doc(`games/${gameCode}`)
        .set({status: 'finished'}, {merge: true});
    cleanUpPlayers();
    cleanUpNotepads();
    cleanUpGame();
}

export function listenForGameChanges(
    code: string,
    setPlayers: (players: Record<string, Player>) => void,
    setNotepads: (notepads: Record<string, Notepad>) => void,
    setGame: (game: Game) => void
) {
    if (!code) return;

    cleanUpNotepads = firebase
        .firestore()
        .collection(`games/${code}/notepads`)
        .onSnapshot(snapshot => {
            const notepads = _.mapValues(_.keyBy(snapshot.docs, "id"), d => d.data() as Notepad);
            setNotepads(notepads);
        });
    cleanUpPlayers = firebase
        .firestore()
        .collection(`games/${code}/players`)
        .onSnapshot(snapshot => {
            const players = _.mapValues(_.keyBy(snapshot.docs, "id"), d => d.data() as Player);
            setPlayers(players);
        });
    cleanUpGame = firebase
        .firestore()
        .doc(`games/${code}`)
        .onSnapshot(snapshot => {
            const game = snapshot.data() as Game;
            setGame(game);
        });
}
