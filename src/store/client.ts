import {createContext} from "react";
import firebase from "firebase";
import _ from "lodash";

import {Action, Actions, ActionTypes, State, Store} from "./client.types";
import {ClientGameState} from "../types/client";
import {finishTurn, joinGame, updateGuess, waitForGameToStart} from "../firebase-client/client";

export const initialState: State = {
    user: null,
    gameCode: "",
    gameState: ClientGameState.LOGIN,
    guess: "",
    content: "",
};

export function reducer(state: State, action: Action): State {
    switch (action.type) {
        case ActionTypes.SET_USER:
            return {...state, user: action.user, gameState: ClientGameState.GAME_SELECTION};
        case ActionTypes.JOIN_GAME:
            joinGame(state.user, action.gameCode);
            return {...state, gameCode: action.gameCode, gameState: ClientGameState.WAITING_TO_START};
        case ActionTypes.GAME_STARTED:
            return {...state, gameState: ClientGameState.IN_GAME};
        case ActionTypes.SET_GUESS:
            _.debounce(() => updateGuess(state.user, state.gameCode, action.guess), 1000);
            return {...state, guess: action.guess};
        case ActionTypes.SUBMIT_GUESS:
            finishTurn(state.user, state.gameCode, action.nextTurnCallback, action.gameFinishedCallback);
            return state;
        case ActionTypes.NEW_CONTENT:
            return {...state, gameState: ClientGameState.IN_GAME, content: action.content, guess: ""};
        case ActionTypes.GAME_FINISHED:
            return {...state, gameState: ClientGameState.FINISHED};
        default:
            return state;
    }
}

export const actionCreators: Actions = {
    setUser: (user: firebase.User | null) => ({type: ActionTypes.SET_USER, user}),
    newContent: (content: string) => ({type: ActionTypes.NEW_CONTENT, content}),
    joinGame: (gameCode: string) => ({type: ActionTypes.JOIN_GAME, gameCode}),
    gameStarted: () => ({type: ActionTypes.GAME_STARTED}),
    setGuess: (guess: string) => ({type: ActionTypes.SET_GUESS, guess}),
    submitGuess: (nextTurnCallback: (content: string) => any, gameFinishedCallback: Function) => ({
        type: ActionTypes.SUBMIT_GUESS,
        nextTurnCallback,
        gameFinishedCallback,
    }),
    gameFinished: () => ({type: ActionTypes.GAME_FINISHED}),
};

export const triggerGameStart = (gameCode: string, startGame: Function) => waitForGameToStart(gameCode, startGame);

export const GameContext = createContext([initialState, actionCreators] as Store);

export const init = _.noop;
