import {User} from "firebase";
import firebase from "firebase/app";
import {v4 as uuid} from "uuid";
import _ from "lodash";

import {UUID} from "../types/shared";
import {Game, Notepad, Status, Player} from "../types/firebase";

export function joinGame(user: User | null, gameCode: string) {
    if (!user) return;
    firebase
        .firestore()
        .collection(`games/${gameCode}/players`)
        .doc(user.uid)
        .set({name: user.displayName});
}

export function waitForGameToStart(gameCode: string, callback: Function) {
    return firebase
        .firestore()
        .doc(`games/${gameCode}`)
        .onSnapshot(snapshot => {
            if ((snapshot.data() as Game).status === Status.InProgress) callback();
        });
}

export async function setSentenceGuess(authorId: UUID, notepadId: UUID, gameCode: string, guess: string) {
    const notepad = (await firebase
        .firestore()
        .doc(`games/${gameCode}/notepads/${notepadId}`)
        .get())
        .data() as Notepad;
    const pages = notepad.pages;

    if (pages.length % 2 === 0) {
        pages.push({
            author: authorId,
            content: guess,
            lastUpdated: firebase.firestore.Timestamp.fromDate(new Date()),
        });
    } else {
        pages[pages.length - 1].content = guess;
    }

    await firebase
        .firestore()
        .doc(`games/${gameCode}/notepads/${notepadId}`)
        .set({pages}, {merge: true});
}

export async function setPictureGuess(authorId: UUID, notepadId: UUID, gameCode: string, guess: string): Promise<string> {
    let fileName;
    const notepadRef = firebase
        .firestore()
        .collection(`games/${gameCode}/notepads/${notepadId}/pages`);
    const notepad = (await notepadRef.get()).docs;

    if (notepad.length % 2 === 1) {
        fileName = `${uuid()}.png`;
        await notepadRef
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

export async function updateGuess(user: User | null, gameCode: string, guess: string) {
    if (!user) return;

    const player = (await firebase
        .firestore()
        .doc(`games/${gameCode}/players/${user.uid}`)
        .get())
        .data() as Player;

    const notepad = (await firebase
        .firestore()
        .doc(`games/${gameCode}/notepads/${player.currentNotepad}`)
        .get())
        .data() as Notepad;

    const needsNewPage = notepad.pages[notepad.pages.length - 1]?.author === user.uid;
    if (
        (notepad.pages.length % 2 === 0 && !needsNewPage) ||
        (notepad.pages.length % 2 === 1 && needsNewPage)
    ) {
        await setSentenceGuess(user.uid, player.currentNotepad, gameCode, guess);
    } else {
        await setPictureGuess(user.uid, player.currentNotepad, gameCode, guess);
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
        .doc(`games/${gameCode}/players/${user.uid}`);

    const {currentNotepad, nextPlayer} = (await firebaseUser.get()).data() || {};

    const nextPlayerQueue = firebase
        .firestore()
        .collection(`games/${gameCode}/players/${nextPlayer}/queue`);
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
