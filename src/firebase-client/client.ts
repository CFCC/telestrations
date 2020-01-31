import { User } from "firebase";
import firebase from "firebase/app";
import uuid from "uuid/v4";

export function joinGame(user: User | null, gameCode: string) {
    if (!user) return;
    firebase
        .firestore()
        .collection(`lobby/${gameCode}/players`)
        .doc(user.uid)
        .set({name: user.displayName});
}

export function setSentenceGuess(user: User | null, gameCode: string, guess: string) {

}

export function setPictureGuess(user: User | null, gameCode: string, guess: string, fileName: string | null): string {
    const id = fileName || `${uuid()}.png`;
    firebase
        .storage()
        .ref()
        .child(id)
        .putString(guess, "data_url");
    
    // Set file name in game object if it isn't already there.
    // update the client? does that need to happen?

    return id;
}