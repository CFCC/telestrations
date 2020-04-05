import * as firebase from "firebase";
import {ClientGameState} from "../types/client";
import {Page} from "../types/firebase";
import {ContentType} from "../types/shared";

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
}

export interface NewContentDTO extends Page {
    type: ContentType;
}

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

export type Action = setUser | joinGame | setGuess | submitGuess | newContent;

export interface Actions extends Record<string, (...args: any) => Action> {
    setUser: (user: firebase.User | null) => setUser,
    newContent: (content: NewContentDTO) => newContent,
    joinGame: (gameCode: string) => joinGame,
    setGuess: (guess: string) => setGuess,
    submitGuess: () => submitGuess,
}

export type Store = [State, Actions];
