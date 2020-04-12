import {User} from "firebase";
import _ from "lodash";
import {createAction, createReducer} from "@reduxjs/toolkit";

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

const setUser = createAction<User | null>("SET_USER");
const newContent = createAction<string>("NEW_CONTENT");
const joinGame = createAction<string>("JOIN_GAME");
const gameStarted = createAction("GAME_STARTED");
const setGuess = createAction<string>("SET_GUESS");
const submitGuess = createAction("SUBMIT_GUESS");
const gameFinished = createAction("GAME_FINISHED");

const reducer = createReducer(defaultState, {
    [setUser.type]: (state, action) => ({
        ...state,
        user: action.user,
        gameState: ClientGameState.GAME_SELECTION,
    }),
    [joinGame.type]: (state, action) => {
        firebaseClient.joinGame(state.user, action.gameCode);
        return {...state, gameCode: action.gameCode, gameState: ClientGameState.WAITING_TO_START};
    },
    [gameStarted.type]: (state, action) => ({
        ...state,
        gameState: ClientGameState.IN_GAME,
    }),
    [setGuess.type]: (state, action) => {
        _.debounce(() => firebaseClient.updateGuess(state.user, state.gameCode, action.guess), 1000);
        return {
            ...state,
            guess: action.guess,
        };
    },
    [submitGuess.type]: (state, action) => {
        firebaseClient.finishTurn(state.user, state.gameCode, action.nextTurnCallback, action.gameFinishedCallback);
    },
    [newContent.type]: (state, action) => ({
        ...state,
        gameState: ClientGameState.IN_GAME,
        content: action.content,
        guess: "",
    }),
    [gameFinished.type]: (state, action) => ({
        ...state,
        gameState: ClientGameState.FINISHED,
    }),
});
