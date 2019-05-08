import {Socket} from "socket.io";
import {ChangeEvent} from "react";

export enum ClientGameState {
    LOADING = 'loading',
    DRAWING = 'drawing',
    TYPING = 'typing',
    FINISHED = 'finished',
    ALREADY_STARTED = 'already started',
    WAITING = 'waiting'
}

export enum ServerWebAppGameState {
    LOADING = 'loading',
    BIRDS_EYE = 'bird\'s eye',
    SINGLE_PLAYER = 'single player',
    PLAYER_HISTORY = 'player history',
    NOTEPAD_HISTORY = 'notepad history'
}

export type UUID = string;

export interface Client {
    id: UUID;
    nickname: string;
    socket: Socket;
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

export interface Player {
    client: Client;
    queue: Array<Notepad>;
}

export enum ContentType {
    Picture = 'picture',
    Text = 'text'
}

export interface NewContentDTO {
    content: string;
    type: ContentType;
}

export type Event = ChangeEvent<HTMLInputElement>;

export enum IOEvent {
    START_GAME = 'start game',
    GAME_ALREADY_STARTED = 'game already started',
    I_AM_A_SERVER = 'i am a server',
    I_AM_A_CLIENT = 'i am a client',
    SUBMIT_NICK = 'submit nick',
    FINISHED_GAME_TURN = 'finished game turn',
    NEW_CONTENT = 'new content',
    WAIT = 'wait',
    NO_MORE_CONTENT = 'no more content',
    PLAYER_ADDED = 'player added',
    PLAYER_REMOVED = 'player removed',
    DISCONNECT = 'disconnect',
    NEW_CLIENT = 'connection'
}

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION__: any
    }
}