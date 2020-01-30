import { ReactNode } from "react";

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
    SET_GAME_STATE = "SET_GAME_STATE",
    SUBMIT_NICKNAME = "SUBMIT_NICKNAME",
    SET_GUESS = "SET_GUESS",
    SUBMIT_GUESS = "SUBMIT_GUESS",
    INIT = "INIT",
}

export interface setUser {
    type: ActionTypes.SET_USER;
    user: firebase.User | null;
}

export interface newContent {
    type: ActionTypes.NEW_CONTENT;
    content: NewContentDTO
}

export interface setGameState {
    type: ActionTypes.SET_GAME_STATE;
    state: ClientGameState;
}

export interface submitNickname {
    type: ActionTypes.SUBMIT_NICKNAME;
    nickname: String;
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

export type Action = setUser | setGameState | submitNickname | setGuess | submitGuess | newContent | init;

export interface Actions extends Record<string, (...args: any) => Action> {
    setUser: (user: firebase.User | null) => setUser,
    newContent: (content: NewContentDTO) => newContent,
    setGameState: (state: ClientGameState) => setGameState,
    submitNickname: (nickname: String) => submitNickname,
    setGuess: (guess: string) => setGuess,
    submitGuess: () => submitGuess,
    init: () => init,
}

export type Store = [State, Actions];
