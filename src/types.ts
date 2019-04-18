import {Socket} from "socket.io";
import {ChangeEvent} from "react";

export enum GameState {
    LOADING = 'loading',
    DRAWING = 'drawing',
    TYPING = 'typing',
    FINISHED = 'finished',
    ALREADY_STARTED = 'already started'
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

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION__: any
    }
}