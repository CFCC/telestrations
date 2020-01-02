export type UUID = string;

export enum IOEvent {
    START_GAME = "start game",
    GAME_ALREADY_STARTED = "game already started",
    SERVER_ALREADY_CONNECTED = "server already connected",
    I_AM_A_SERVER = "i am a server",
    I_AM_A_CLIENT = "i am a client",
    SUBMIT_NICK = "submit nick",
    UPDATE_GUESS = "update guess",
    FINISHED_GAME_TURN = "finished game turn",
    NEW_CONTENT = "new content",
    WAIT = "wait",
    NO_MORE_CONTENT = "no more content",
    GAME_FINISHED = "game finished",
    PLAYER_ADDED = "player added",
    PLAYER_REMOVED = "player removed",
    DISCONNECT = "disconnect",
    NEW_CLIENT = "connection"
}

export enum ContentType {
    Picture = "picture",
    Text = "text"
}

export interface Events {
    [s: string]: Function;
}
