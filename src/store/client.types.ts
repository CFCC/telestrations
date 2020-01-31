import { ClientGameState } from "types/client";
import { NewContentDTO } from "types/server";

export interface State extends Record<string, any> {
    user: firebase.User | null;
    gameCode: string;
    gameState: ClientGameState;
    guess: string;
    content: string;
}

export enum ActionTypes {
    SET_USER = "SET_USER",
    NEW_CONTENT = "NEW_CONTENT",
    JOIN_GAME = "JOIN_GAME",
    SET_GUESS = "SET_GUESS",
    SUBMIT_GUESS = "SUBMIT_GUESS",
    INIT = "INIT",
}

// #region Actions

export interface setUser {
    type: ActionTypes.SET_USER;
    user: firebase.User | null;
}

export interface newContent {
    type: ActionTypes.NEW_CONTENT;
    content: NewContentDTO
}

export interface joinGame {
    type: ActionTypes.JOIN_GAME;
    gameCode: string;
}

export interface setGuess {
    type: ActionTypes.SET_GUESS;
    guess: string;
}

export interface submitGuess {
    type: ActionTypes.SUBMIT_GUESS;
}

export interface init {
    type: ActionTypes.INIT;
}

// #endregion

export type Action = setUser | joinGame | setGuess | submitGuess | newContent | init;

export interface Actions extends Record<string, (...args: any) => Action> {
    setUser: (user: firebase.User | null) => setUser,
    newContent: (content: NewContentDTO) => newContent,
    joinGame: (gameCode: string) => joinGame,
    setGuess: (guess: string) => setGuess,
    submitGuess: () => submitGuess,
    init: () => init,
}

export type Store = [State, Actions];
