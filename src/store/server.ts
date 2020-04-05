import {createContext} from "react";

import * as firebase from "../firebase-client/server";
import {ServerGameState} from "../types/server";
import {UUID} from "../types/shared";
import {
    Action,
    Actions,
    ActionTypes,
    gameFinished,
    setGameCode,
    startGame,
    State,
    Store,
    updateGame,
    viewNotepadHistory,
    viewPlayerHistory
} from "./server.types";
import {Game} from "../types/firebase";

export const initialState: State = {
    gameState: ServerGameState.GAME_CODE,
    gameCode: "",
    game: undefined,
    activePlayerId: "",
    activeNotepadId: "",
};

export function reducer(state: State, action: Action): State {
    switch (action.type) {
        case ActionTypes.SET_GAME_CODE:
            const serverId = localStorage.getItem('serverId') ?? '';
            firebase.addGameToLobby(action.gameCode, serverId);
            return {...state, gameCode: action.gameCode, gameState: ServerGameState.LOADING};
        case ActionTypes.START_GAME:
            // io.startGame();
            return {
                ...state,
                gameState: ServerGameState.BIRDS_EYE,
            };
        default:
            return state;
    }
}

export const actionCreators: Actions = {
    setGameCode: (gameCode: string) => ({type: ActionTypes.SET_GAME_CODE, gameCode} as setGameCode),
    viewPlayerHistory: (playerId: UUID) => ({type: ActionTypes.VIEW_PLAYER_HISTORY, playerId} as viewPlayerHistory),
    viewNotepadHistory: (ownerId: UUID) => ({type: ActionTypes.VIEW_NOTEPAD_HISTORY, ownerId} as viewNotepadHistory),
    startGame: () => ({type: ActionTypes.START_GAME} as startGame),
    updateGame: (game: Game) => ({type: ActionTypes.UPDATE_GAME, game} as updateGame),
    gameFinished: () => ({type: ActionTypes.GAME_FINISHED} as gameFinished),
};

export const GameContext = createContext([initialState, actionCreators] as Store);
