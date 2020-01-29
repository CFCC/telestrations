import * as firebase from 'firebase/app';

export function addGameToLobby(gameCode: string) {
    firebase
        .firestore()
        .collection('lobby')
        .doc(gameCode)
        .set({created: Date.now()});
}
