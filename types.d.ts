/// <reference types="react-scripts" />
import {Socket} from "socket.io";

export type GameState = 'loading' | 'drawing' | 'typing' | 'finished' | 'already started';

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

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION__: any
    }
}