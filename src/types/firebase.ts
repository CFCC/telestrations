import firebase from "firebase";

export type WithId<T extends {}> = T & {
    id: string;
}

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

export interface Game {
    created: firebase.firestore.Timestamp;
    status: "lobby" | "in progress" | "finished";
    notepads: Record<string, Notepad>;
    players: Record<string, Player>;
}
