import * as firebase from "firebase";
import {ClientGameState} from "../types/client";

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
    GAME_STARTED = "GAME_STARTED",
    GAME_FINISHED = "GAME_FINISHED",
    SET_GUESS = "SET_GUESS",
    SUBMIT_GUESS = "SUBMIT_GUESS",
}

export interface setUser {
    type: ActionTypes.SET_USER;
    user: firebase.User | null;
}

export interface newContent {
    type: ActionTypes.NEW_CONTENT;
    content: string;
}

export interface joinGame {
    type: ActionTypes.JOIN_GAME;
    gameCode: string;
}

export interface gameStarted {
    type: ActionTypes.GAME_STARTED;
}

export interface gameFinished {
    type: ActionTypes.GAME_FINISHED;
}

export interface setGuess {
    type: ActionTypes.SET_GUESS;
    guess: string;
}

export interface submitGuess {
    type: ActionTypes.SUBMIT_GUESS;
    nextTurnCallback: (content: string) => any;
    gameFinishedCallback: Function;
}

export type Action =
    setUser |
    joinGame |
    gameStarted |
    setGuess |
    submitGuess |
    newContent |
    gameFinished;

export interface Actions extends Record<string, (...args: any) => Action> {
    setUser: (user: firebase.User | null) => setUser,
    newContent: (content: string) => newContent,
    joinGame: (gameCode: string) => joinGame,
    gameStarted: () => gameStarted,
    setGuess: (guess: string) => setGuess,
    submitGuess: (nextTurnCallback: (content: string) => any, gameFinishedCallback: Function) => submitGuess,
    gameFinished: () => gameFinished,
}

export type Store = [State, Actions];
