import * as firebase from "../firebase-client/server";
import {ServerGameState} from "../types/web";
import {Game, Notepad, Player} from "../types/firebase";
import {configureStore, createAction, createReducer} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useSelector as useUntypedSelector} from "react-redux";

interface State {
    gameState: ServerGameState;
    game: Game;
    gameCode: string;
    activePlayerId: string;
    activeNotepadId: string;
}

const defaultState: State = {
    gameState: ServerGameState.GAME_CODE,
    gameCode: "",
    game: {
        players: {},
        notepads: {},
        created: -1,
        status: "lobby",
    },
    activePlayerId: "",
    activeNotepadId: "",
};

export const setGameCode = createAction<string>("SET_GAME_CODE");
export const viewPlayerHistory = createAction<string>("VIEW_PLAYER_HISTORY");
export const viewNotepadHistory = createAction<string>("VIEW_NOTEPAD_HISTORY");
export const startGame = createAction("START_GAME");
export const updateGame = createAction<Pick<Game, "created" | "status">>("UPDATE_GAME");
export const updateNotepads = createAction<Record<string, Notepad>>("UPDATE_NOTEPADS");
export const updatePlayers = createAction<Record<string, Player>>("UPDATE_PLAYERS");
export const gameFinished = createAction("GAME_FINISHED");

const reducer = createReducer(defaultState, builder => builder
    .addCase(setGameCode, (state, action) => {
        const serverId = localStorage.getItem('serverId') ?? '';
        firebase.addGameToLobby(action.payload, serverId);
        return {
            ...state,
            gameState: ServerGameState.LOADING,
            gameCode: action.payload,
        };
    })
    .addCase(startGame, state => {
        firebase.startGame(state.gameCode, Object.keys(state.game.players));
        return {
            ...state,
            gameState: ServerGameState.BIRDS_EYE,
        };
    })
    .addCase(viewPlayerHistory, (state, action) => ({
        ...state,
        activePlayerId: action.payload,
    }))
    .addCase(viewNotepadHistory, (state, action) => ({
        ...state,
        activeNotepadId: action.payload,
    }))
    .addCase(gameFinished, state => {
        firebase.endGame(state.gameCode);
    })
    .addCase(updateGame, (state, action) => ({
        ...state,
        game: {
            ...state.game,
            ...action.payload,
        },
    }))
    .addCase(updateNotepads, (state, action) => ({
        ...state,
        game: {
            ...state.game,
            notepads: action.payload,
        },
    }))
    .addCase(updatePlayers, (state, action) => ({
        ...state,
        game: {
            ...state.game,
            players: action.payload,
        },
    }))
);

export const store = configureStore({reducer});

export const useSelector: TypedUseSelectorHook<ReturnType<typeof reducer>> = useUntypedSelector;
