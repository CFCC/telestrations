import {ChangeEvent, RefObject} from "react";

// region [Shared Types]

export type UUID = string;

export enum IOEvent {
    START_GAME = 'start game',
    GAME_ALREADY_STARTED = 'game already started',
    I_AM_A_SERVER = 'i am a server',
    I_AM_A_CLIENT = 'i am a client',
    SUBMIT_NICK = 'submit nick',
    UPDATE_GUESS = 'update guess',
    FINISHED_GAME_TURN = 'finished game turn',
    NEW_CONTENT = 'new content',
    WAIT = 'wait',
    NO_MORE_CONTENT = 'no more content',
    GAME_FINISHED = 'game finished',
    PLAYER_ADDED = 'player added',
    PLAYER_REMOVED = 'player removed',
    DISCONNECT = 'disconnect',
    NEW_CLIENT = 'connection'
}

export enum ContentType {
    Picture = 'picture',
    Text = 'text'
}

// endregion

export namespace Client {
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
}

export namespace Server {

    export interface NewContentDTO {
        content: string;
        type: ContentType;
    }

    export interface PlayerDTO {
        id: UUID;
        nickname: string;
    }

    export interface ServerPlayer {
        id: UUID;
        nickname: string;
        queueOfOwners: Array<UUID>;
        notepadIndex: number;
    }

    export interface NotepadPageDTO {
        playerId: UUID;
        content: string;
    }

    export interface FinishedGameTurnDTO {
        playerId: UUID;
        newNotepadOwnerId: UUID;
    }
}

export namespace ServerWebapp {
    export enum ServerWebAppGameState {
        LOADING = 'loading',
        BIRDS_EYE = 'bird\'s eye',
        SINGLE_PLAYER = 'single player',
        PLAYER_HISTORY = 'player history',
        NOTEPAD_HISTORY = 'notepad history'
    }

    export type Event = ChangeEvent<HTMLInputElement>;
}

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION__: any
    }
}