import { User } from "firebase";
import firebase from "firebase/app";
import uuid from "uuid/v4";
import _ from "lodash";

import {UUID} from "types/shared";

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

export function updateGuess(notepadId: UUID, gameCode: string, guess: string) {

}

export function finishTurn(user: User | null) {

}
