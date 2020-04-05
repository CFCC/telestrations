import firebase from 'firebase/app';

import {PlayerDTO} from "../types/server";

export function addGameToLobby(gameCode: string, serverId: string) {
    firebase
        .firestore()
        .doc(`games/${gameCode}`)
        .set({created: Date.now(), state: 'lobby', serverId});
}

export function startGame(gameCode: string) {
    firebase
        .firestore()
        .doc(`games/${gameCode}`)
        .set({state: 'in progress'}, {merge: true});
}

export function endGame(gameCode: string) {
    firebase
        .firestore()
        .doc(`games/${gameCode}`)
        .set({state: 'finished'}, {merge: true});
}

export function listenForPlayers(gameCode: string, callback: (players: PlayerDTO[]) => void) {
    firebase
        .firestore()
        .doc(`games/${gameCode}`)
        .collection('players')
        .onSnapshot(async snapshot => {
            const players = await Promise.all(snapshot.docs.map(async doc => await doc.data())) as PlayerDTO[];
            callback(players);
        });
}
