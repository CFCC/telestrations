import {User} from "firebase";
import firebase from "firebase/app";
import {v4 as uuid} from "uuid";
import _ from "lodash";
import {Game, Notepad, Player, Status} from "../types/firebase";

export async function joinGame(user: User | null, gameCode: string) {
    if (!user) return;
    await firebase
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

export async function setSentenceGuess(authorId: string, notepadId: string, gameCode: string, guess: string) {
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

export async function setPictureGuess(authorId: string, notepadId: string, gameCode: string, guess: string): Promise<string> {
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

export async function finishTurn(
    user: User | null,
    gameCode: string,
    nextTurnCallback: (content: string) => any,
    gameFinishedCallback: Function
) {
    if (!user) return;

    const playerRef = firebase
        .firestore()
        .doc(`games/${gameCode}/players/${user.uid}`);
    const {currentNotepad, nextPlayer, queue} = (await playerRef.get()).data() as Player;

    const nextPlayerRef = firebase
        .firestore()
        .doc(`games/${gameCode}/players/${nextPlayer}`);
    const {queue: nextPlayerQueue} = (await nextPlayerRef.get()).data() as Player;

    await nextPlayerRef.set({queue: [...nextPlayerQueue, currentNotepad]}, {merge: true});


    const firstQueueItem = queue.shift();
    await playerRef.set({currentNotepad: firstQueueItem}, {merge: true});
    if (firstQueueItem === undefined) {
        const unsubscribe = playerRef.onSnapshot(async snapshot => {
            const playerSnapshot = snapshot.data() as Player;
            if (_.eq(playerSnapshot.queue, queue) || _.isEmpty(playerSnapshot.queue)) return;

            const newQueue = [...playerSnapshot.queue];
            const queueItem = newQueue.shift();
            const notepad = (await firebase
                .firestore()
                .doc(`games/${gameCode}/notepads/${queueItem}`)
                .get())
                .data() as Notepad;

            if (notepad.ownerId === user.uid) {
                gameFinishedCallback();
            } else {
                nextTurnCallback(notepad.pages[notepad.pages.length - 1].content);
            }

            await playerRef.set({queue: newQueue, currentNotepad: queueItem}, {merge: true});
            unsubscribe();
        });
    }
}
