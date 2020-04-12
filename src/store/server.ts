import * as firebase from "../firebase-client/server";
import {ServerGameState} from "../types/server";
import {Game, Notepad, Player, Status} from "../types/firebase";
import {createAction, createReducer} from "@reduxjs/toolkit";

interface State {
    gameState: ServerGameState;
    game: Game;
    gameCode: string;
    activePlayerId: string;
    activeNotepadId: string;
}

export const defaultState: State = {
    gameState: ServerGameState.GAME_CODE,
    gameCode: "",
    game: {
        players: {},
        notepads: {},
        created: -1,
        status: Status.Lobby,
    },
    activePlayerId: "",
    activeNotepadId: "",
};

const setGameCode = createAction<string>("SET_GAME_CODE");
const viewPlayerHistory = createAction<string>("VIEW_PLAYER_HISTORY");
const viewNotepadHistory = createAction<string>("VIEW_NOTEPAD_HISTORY");
const startGame = createAction("START_GAME");
const updateGame = createAction<Pick<Game, "created" | "status">>("UPDATE_GAME");
const updateNotepads = createAction<Record<string, Notepad>>("UPDATE_NOTEPADS");
const updatePlayers = createAction<Record<string, Player>>("UPDATE_PLAYERS");
const gameFinished = createAction("GAME_FINISHED");

const reducer = createReducer(defaultState, {
    [setGameCode.type]: (state, action) => {
        const serverId = localStorage.getItem('serverId') ?? '';
        if (action.gameIsNew) firebase.addGameToLobby(action.gameCode, serverId);
        return {
            ...state,
            gameState: action.gameIsNew ? ServerGameState.LOADING : ServerGameState.BIRDS_EYE,
            gameCode: action.gameCode,
        };
    },
    [startGame.type]: (state, action) => {
        firebase.startGame(state.gameCode, Object.keys(state.game.players));
        return {...state, gameState: ServerGameState.BIRDS_EYE};
    },
    [viewPlayerHistory.type]: (state, action) => ({
        ...state,
        activePlayerId: action.playerId,
    }),
    [viewNotepadHistory.type]: (state, action) => ({
        ...state,
        activeNotepadId: action.ownerId,
    }),
    [gameFinished.type]: (state, action) => {
        firebase.endGame(state.gameCode);
    },
    [updateGame.type]: (state, action) => ({
        ...state,
        game: {
            ...state.game,
            ...action.game,
        },
    }),
    [updateNotepads.type]: (state, action) => ({
        ...state,
        game: {
            ...state.game,
            notepads: action.notepads,
        },
    }),
    [updatePlayers.type]: (state, action) => ({
        ...state,
        game: {
            ...state.game,
            players: action.players,
        },
    }),
});
