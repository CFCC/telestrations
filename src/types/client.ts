import {RefObject} from "react";
import {ContentType, UUID} from "../types";

export enum ClientGameState {
    LOADING = 'loading',
    DRAWING = 'drawing',
    TYPING = 'typing',
    FINISHED = 'finished',
    ALREADY_STARTED = 'already started',
    WAITING = 'waiting'
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

export interface ObjectOfRefs {
    [s: string]: RefObject<{}>
}