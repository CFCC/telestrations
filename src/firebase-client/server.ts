import firebase from 'firebase/app';
import _ from "lodash";
import {v4 as uuid} from "uuid";

import {Game, Notepad, Player, Status} from "../types/firebase";

export function addGameToLobby(gameCode: string, serverId: string) {
    firebase
        .firestore()
        .doc(`games/${gameCode}`)
        .set({
            created: Date.now(),
            status: Status.Lobby,
            serverId,
        });
}

export function startGame(gameCode: string, playerIds: string[]) {
    playerIds.forEach((playerId, i) => {
        const notepadId = uuid();
        firebase
            .firestore()
            .collection(`games/${gameCode}/notepads`)
            .doc(notepadId)
            .set({
                ownerId: playerId,
                pages: [],
            } as Notepad);
        firebase
            .firestore()
            .doc(`games/${gameCode}/players/${playerId}`)
            .set({
                currentNotepad: notepadId,
                nextPlayer: playerIds[(i + 1) % playerIds.length],
                queue: [],
            }, {merge: true});
    })

    firebase
        .firestore()
        .doc(`games/${gameCode}`)
        .set({status: Status.InProgress}, {merge: true});
}

let cleanUpPlayers: () => void;
let cleanUpNotepads: () => void;
let cleanUpGame: () => void;
export function endGame(gameCode: string) {
    firebase
        .firestore()
        .doc(`games/${gameCode}`)
        .set({status: Status.Finished}, {merge: true});
    cleanUpPlayers();
    cleanUpNotepads();
    cleanUpGame();
}

export function listenForGameChanges(
    gameCode: string,
    setPlayers: (players: Record<string, Player>) => void,
    setNotepads: (notepads: Record<string, Notepad>) => void,
    setGame: (game: Game) => void
) {
    if (!gameCode) return;

    cleanUpNotepads = firebase
        .firestore()
        .collection(`games/${gameCode}/notepads`)
        .onSnapshot(snapshot => {
            const notepads = _.mapValues(_.keyBy(snapshot.docs, "id"), d => d.data() as Notepad);
            setNotepads(notepads);
        });
    cleanUpPlayers = firebase
        .firestore()
        .collection(`games/${gameCode}/players`)
        .onSnapshot(snapshot => {
            const players = _.mapValues(_.keyBy(snapshot.docs, "id"), d => d.data() as Player);
            setPlayers(players);
        });
    cleanUpGame = firebase
        .firestore()
        .doc(`games/${gameCode}`)
        .onSnapshot(snapshot => {
            const game = snapshot.data() as Game;
            setGame(game);
        });
}
