import firebase from 'firebase/app';
import uuid from "uuid/v4";

import {IOEvent} from "types/shared";
import {Player} from "../types/firebase";

type Events = {
    [event in IOEvent]?: (...args: any) => any;
};

let events = {};
export function attachEvents(e: Events) {
    events = e;
}

export function joinGame(code: string, player: firebase.User) {
    firebase
        .firestore()
        .collection(`lobby/${code}/players`)
        .add({
            name: player.displayName,
            id: player.uid,
        });
}

export function setGuess(user: firebase.User, guess: string, gameCode: string, picture?: string): string | void {
    if (picture) {
        if (picture === "") picture = uuid();
        firebase.storage().ref().child(`${gameCode}/${picture}.png`).putString(guess, 'data_url');
        return picture;
    } else {
        const game = firebase.firestore().doc(`in-progress/${gameCode}`);
        game
            .collection("players")
            .doc(user.uid)
            .get()
            .then(playerDoc => playerDoc.data() as Player)
            .then(player => game
                .collection("notepads")
                .doc(player.notepadId)
                .collection("content")
                .doc(player.currentIndex.toString())
                .set({value: guess}));
    }
}

export function submitGuess(player: firebase.User) {

}
