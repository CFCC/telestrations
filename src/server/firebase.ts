import * as firebase from 'firebase/app';

export function addGameToLobby(gameCode: string) {
    firebase.firestore().collection('lobby').add({
        created: Date.now(),
        gameCode,
    });
}
