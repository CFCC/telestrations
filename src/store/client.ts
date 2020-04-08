import {createContext} from "react";
import firebase from "firebase";
import _ from "lodash";

import {Action, Actions, ActionTypes, NewContentDTO, State, Store} from "./client.types";
import {ClientGameState} from "../types/client";
import {ContentType} from "../types/shared";
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
            return {...state, gameState: ClientGameState.TYPING};
        case ActionTypes.SET_GUESS:
            updateGuess(state.user, state.notepadId, state.gameCode, action.guess);
            return {...state, guess: action.guess};
        case ActionTypes.SUBMIT_GUESS:
            finishTurn(state.user, state.gameCode);
            return state;
        case ActionTypes.NEW_CONTENT:
            return {
                ...state,
                gameState: action.content.type === ContentType.Text ? ClientGameState.DRAWING : ClientGameState.TYPING,
                content: action.content.content,
                guess: "",
            };
        default:
            return state;
    }
}

export const actionCreators: Actions = {
    setUser: (user: firebase.User | null) => ({type: ActionTypes.SET_USER, user}),
    newContent: (content: NewContentDTO) => ({type: ActionTypes.NEW_CONTENT, content}),
    joinGame: (gameCode: string) => ({type: ActionTypes.JOIN_GAME, gameCode}),
    gameStarted: () => ({type: ActionTypes.GAME_STARTED}),
    setGuess: (guess: string) => ({type: ActionTypes.SET_GUESS, guess}),
    submitGuess: () => ({type: ActionTypes.SUBMIT_GUESS}),
};

export const triggerGameStart = (gameCode: string, startGame: Function) => waitForGameToStart(gameCode, startGame);

export const GameContext = createContext([initialState, actionCreators] as Store);

export const init = _.noop;
