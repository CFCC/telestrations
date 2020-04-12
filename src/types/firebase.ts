import firebase from "firebase";

export interface Page {
    content: string;
    lastUpdated: firebase.firestore.Timestamp;
    author: string;
}

export interface Notepad {
    ownerId: string;
    pages: Page[];
}

export interface Player {
    currentNotepad: string;
    nextPlayer: string;
    name: string;
    queue: string[];
}

export enum Status {
    Lobby = "lobby",
    InProgress = "in progress",
    Finished = "finished"
}

export interface Game {
    created: number;
    status: Status;
    notepads: Record<string, Notepad>;
    players: Record<string, Player>;
}
