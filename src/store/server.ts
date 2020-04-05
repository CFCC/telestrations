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
import {Game, Status} from "../types/firebase";

export const initialState: State = {
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

export function reducer(state: State, action: Action): State {
    switch (action.type) {
        case ActionTypes.SET_GAME_CODE:
            const serverId = localStorage.getItem('serverId') ?? '';
            firebase.addGameToLobby(action.gameCode, serverId);
            firebase.listenForGame(action.setGameCallback);
            return {...state, gameState: ServerGameState.LOADING, gameCode: action.gameCode};
        case ActionTypes.START_GAME:
            firebase.startGame();
            return {...state, gameState: ServerGameState.BIRDS_EYE};
        case ActionTypes.VIEW_PLAYER_HISTORY:
            return {...state, activePlayerId: action.playerId};
        case ActionTypes.VIEW_NOTEPAD_HISTORY:
            return {...state, activeNotepadId: action.ownerId};
        case ActionTypes.GAME_FINISHED:
            firebase.endGame();
            return state;
        case ActionTypes.UPDATE_GAME:
            return {...state, game: action.game};
        default:
            return state;
    }
}

export const actionCreators: Actions = {
    setGameCode: (gameCode: string, setGameCallback: (game: Game) => void) => ({
        type: ActionTypes.SET_GAME_CODE,
        gameCode,
        setGameCallback,
    } as setGameCode),
    viewPlayerHistory: (playerId: UUID) => ({type: ActionTypes.VIEW_PLAYER_HISTORY, playerId} as viewPlayerHistory),
    viewNotepadHistory: (ownerId: UUID) => ({type: ActionTypes.VIEW_NOTEPAD_HISTORY, ownerId} as viewNotepadHistory),
    startGame: () => ({type: ActionTypes.START_GAME} as startGame),
    updateGame: (game: Game) => ({type: ActionTypes.UPDATE_GAME, game} as updateGame),
    gameFinished: () => ({type: ActionTypes.GAME_FINISHED} as gameFinished),
};

export const GameContext = createContext([initialState, actionCreators] as Store);
