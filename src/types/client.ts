import {ContentType, UUID} from "types/shared";

export enum ClientGameState {
    GAME_SELECTION = "game selection",
    LOGIN = "login",
    WAITING_TO_START = "waiting to start",
    DRAWING = "drawing",
    TYPING = "typing",
    FINISHED = "finished",
    ALREADY_STARTED = "already started",
    WAITING_FOR_CONTENT = "waiting for content"
}

export interface Notepad {
    owner: UUID;

    // Even indices (including 0) are sentences, odd indices are base64 sources of images
    content: Array<string>;
}

export interface NotepadPage {
    text: string;
    picture: string;
    turnState: ClientGameState;
}

export interface Guess {
    content: string;
    type: ContentType;
}

export interface Player {
    id: UUID;
    nickname: string;
    guess: Guess;
    queue: Array<Notepad>;
}
