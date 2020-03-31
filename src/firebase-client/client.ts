import { User } from "firebase";
import firebase from "firebase/app";
import {v4 as uuid} from "uuid";
import _ from "lodash";

import {UUID} from "../types/shared";

export function joinGame(user: User | null, gameCode: string) {
    if (!user) return;
    firebase
        .firestore()
        .collection(`games/${gameCode}/players`)
        .doc(user.uid)
        .set({name: user.displayName});
}

export async function setSentenceGuess(notepadId: UUID, gameCode: string, guess: string) {
    const notepadRef = firebase
        .firestore()
        .collection(`games/${gameCode}/notepads/${notepadId}/pages`);
    const notepad = (await notepadRef.get()).docs;

    notepadRef
        .doc((notepad.length % 2 === 1 ? notepad.length - 1 : notepad.length).toString())
        .set({content: guess});
}

export async function setPictureGuess(notepadId: UUID, gameCode: string, guess: string): Promise<string> {
    let fileName;
    const notepadRef = firebase
        .firestore()
        .collection(`games/${gameCode}/notepads/${notepadId}/pages`);
    const notepad = (await notepadRef.get()).docs;

    if (notepad.length % 2 === 1) {
        fileName = `${uuid()}.png`;
        notepadRef
            .doc(notepad.length.toString())
            .set({content: fileName});
    } else {
        fileName = _.last(notepad)?.data().content;
    }

    firebase
        .storage()
        .ref()
        .child(fileName)
        .putString(guess, "data_url");

    return fileName;
}

export async function updateGuess(user: User | null, notepadId: UUID, gameCode: string, guess: string) {
    if (!user) return;

    const firebaseUser = await firebase
        .firestore()
        .doc(`games/${gameCode}/users/${user.uid}`)
        .get();

    if (firebaseUser.data()?.currentIndex % 2 === 1) {
        await setPictureGuess(notepadId, gameCode, guess);
    } else {
        await setSentenceGuess(notepadId, gameCode, guess);
    }
}

export enum FinishedTurnStatus {
    MORE_CONTENT, WAIT, GAME_FINISHED, NULL_USER
}

export interface FinishedTurnResult {
    status: FinishedTurnStatus;
    nextNotepad?: UUID;
}

export async function finishTurn(user: User | null, gameCode: string): Promise<FinishedTurnResult> {
    if (!user) return {status: FinishedTurnStatus.NULL_USER};

    const firebaseUser = await firebase
        .firestore()
        .doc(`games/${gameCode}/users/${user.uid}`);

    const {currentNotepad, nextPlayer} = (await firebaseUser.get()).data() || {};

    const nextPlayerQueue = firebase
        .firestore()
        .collection(`games/${gameCode}/users/${nextPlayer}/queue`);
    const queueLength = (await nextPlayerQueue.get()).docs.length;
    nextPlayerQueue.doc(queueLength.toString()).set({notepadId: currentNotepad});

    const firstQueueItem = (await firebaseUser
        .collection('queue')
        .doc('0')
        .get())
        .data();

    if (firstQueueItem === undefined) return {status: FinishedTurnStatus.WAIT};

    const {ownerId} = (await firebase
        .firestore()
        .doc(`games/${gameCode}/notepads/${firstQueueItem.notepadId}`)
        .get())
        .data() || {};

    if (ownerId === user.uid) return {status: FinishedTurnStatus.GAME_FINISHED};

    return {
        status: FinishedTurnStatus.MORE_CONTENT,
        nextNotepad: firstQueueItem.notepadId,
    };
}

export async function waitForNewContent(user: firebase.User | null, gameCode: string, callback: (notepadId: UUID) => any) {
    if (!user) return;

    firebase
        .firestore()
        .collection(`games/${gameCode}/users/${user.uid}/queue`)
        .onSnapshot(snapshot => {
            const notepadId = snapshot.docs[0].data().notepadId;
            callback(notepadId);
        });
}
