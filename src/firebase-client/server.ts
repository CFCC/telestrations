import firebase from 'firebase/app';

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
