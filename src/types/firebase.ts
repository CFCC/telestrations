export interface Page {
    content: string;
    lastUpdated: string;
    author: string;
}

export interface Notepad {
    ownerId: string;
    pages: Record<string, Page>;
}

export interface QueuedNotepad {
    notepadId: string;
}

export interface Player {
    currentNotepad: string;
    nextPlayer: string;
    name: string;
    queue: Record<string, QueuedNotepad>;
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
