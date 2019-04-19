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
    SINGLE_HISTORY = 'single history'
}

export type UUID = String;

export interface Client {
    id: UUID;
    nickname: String;
    socket: Socket;
}

export interface GameItem {
    owner: UUID;
    next: UUID;

    // Even indices (including 0) are sentences, odd indices are base64 sources of images
    content: Array<String>;
}

export type Event = ChangeEvent<HTMLInputElement>;

export enum IOEvent {
    START_GAME = 'start game',
    GAME_ALREADY_STARTED = 'game already started',
    I_AM_A_SERVER = 'i am a server',
    I_AM_A_CLIENT = 'i am a client',
    SUBMIT_NICK = 'submit nick',
    FINISHED_GAME_TURN = 'finished game turn',
    PLAYER_ADDED = 'player added',
    NEW_CONTENT = 'new content',
    DISCONNECT = 'disconnect',
    NEW_CLIENT = 'connection'
}

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION__: any
    }
}