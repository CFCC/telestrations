/// <reference types="react-scripts" />
import {Socket} from "socket.io";

export type GameState = 'loading' | 'drawing' | 'typing' | 'finished';

export interface Client {
    id: String;
    nickname: String;
    socket: Socket;
}

export interface GameItem {
    owner: String;

    // Even indices (including 0) are sentences, odd indices are base64 sources of images
    content: Array<String>;
}