import {User} from "firebase";
import _ from "lodash";
import {configureStore, createAction, createReducer} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useSelector as useUntypedSelector} from "react-redux";

import {ClientGameState} from "../types/web";
import * as firebaseClient from "../firebase-client/client";

interface State {
    user: User | null;
    gameCode: string;
    gameState: ClientGameState;
    guess: string;
    content: string;
}

const defaultState: State = {
    user: null,
    gameCode: "",
    gameState: ClientGameState.LOGIN,
    guess: "",
    content: "",
};

export const setUser = createAction<User | null>("SET_USER");
export const newContent = createAction<string>("NEW_CONTENT");
export const joinGame = createAction<string>("JOIN_GAME");
export const gameStarted = createAction("GAME_STARTED");
export const setGuess = createAction<string>("SET_GUESS");
export const submitGuess = createAction("SUBMIT_GUESS");
export const gameFinished = createAction("GAME_FINISHED");

const reducer = createReducer(defaultState, builder => builder
    .addCase(setUser, (state, action) => ({
        ...state,
        user: action.payload,
        gameState: ClientGameState.GAME_SELECTION,
    }))
    .addCase(joinGame, (state, action) => {
        firebaseClient.joinGame(state.user, action.payload);
        return {
            ...state,
            gameCode: action.payload,
            gameState: ClientGameState.WAITING_TO_START,
        };
    })
    .addCase(gameStarted, state => ({
        ...state,
        gameState: ClientGameState.IN_GAME,
    }))
    .addCase(setGuess, (state, action) => {
        _.debounce(() => firebaseClient.updateGuess(state.user, state.gameCode, action.payload), 1000);
        return {
            ...state,
            guess: action.payload,
        };
    })
    .addCase(submitGuess, state => {
        firebaseClient.finishTurn(state.user, state.gameCode);
    })
    .addCase(newContent, (state, action) => ({
        ...state,
        gameState: ClientGameState.IN_GAME,
        content: action.payload,
        guess: "",
    }))
    .addCase(gameFinished, state => ({
        ...state,
        gameState: ClientGameState.FINISHED,
    }))
);

export const store = configureStore({reducer});

export const useSelector: TypedUseSelectorHook<ReturnType<typeof reducer>> = useUntypedSelector;
