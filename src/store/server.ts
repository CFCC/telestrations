import {createContext, Dispatch} from "react";

import * as firebase from "../firebase-client/server";
import {ServerGameState} from "../types/server";
import {Action, Actions, ActionTypes, State, Store} from "./server.types";
import {Game, Notepad, Player, Status} from "../types/firebase";

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
        case ActionTypes.SET_GAME_CODE: {
            const serverId = localStorage.getItem('serverId') ?? '';
            if (action.gameIsNew) firebase.addGameToLobby(action.gameCode, serverId);
            return {
                ...state,
                gameState: action.gameIsNew ? ServerGameState.LOADING : ServerGameState.BIRDS_EYE,
                gameCode: action.gameCode,
            };
        }
        case ActionTypes.START_GAME:
            firebase.startGame(state.gameCode, Object.keys(state.game.players));
            return {...state, gameState: ServerGameState.BIRDS_EYE};
        case ActionTypes.VIEW_PLAYER_HISTORY:
            return {...state, activePlayerId: action.playerId};
        case ActionTypes.VIEW_NOTEPAD_HISTORY:
            return {...state, activeNotepadId: action.ownerId};
        case ActionTypes.GAME_FINISHED:
            firebase.endGame(state.gameCode);
            return state;
        case ActionTypes.UPDATE_GAME:
            return {...state, game: {...state.game, ...action.game}};
        case ActionTypes.UPDATE_NOTEPADS:
            return {...state, game: {...state.game, notepads: action.notepads}};
        case ActionTypes.UPDATE_PLAYERS:
            return {...state, game: {...state.game, players: action.players}};
        default:
            return state;
    }
}

export const actionCreators: Actions = {
    setGameCode: (gameCode, setNotepads, setPlayers, gameIsNew = true) => ({
        type: ActionTypes.SET_GAME_CODE,
        gameCode,
        setPlayers,
        setNotepads,
        gameIsNew,
    }),
    viewPlayerHistory: playerId => ({type: ActionTypes.VIEW_PLAYER_HISTORY, playerId}),
    viewNotepadHistory: ownerId => ({type: ActionTypes.VIEW_NOTEPAD_HISTORY, ownerId}),
    startGame: () => ({type: ActionTypes.START_GAME}),
    updateGame: game => ({type: ActionTypes.UPDATE_GAME, game}),
    updateNotepads: notepads => ({type: ActionTypes.UPDATE_NOTEPADS, notepads}),
    updatePlayers: players => ({type: ActionTypes.UPDATE_PLAYERS, players}),
    gameFinished: () => ({type: ActionTypes.GAME_FINISHED}),
};

export const GameContext = createContext([initialState, actionCreators] as Store);

export const init = (dispatch: Dispatch<any>, gameCode: string) => {
    const setPlayers = (players: Record<string, Player>) => dispatch(actionCreators.updatePlayers(players));
    const setNotepads = (notepads: Record<string, Notepad>) => dispatch(actionCreators.updateNotepads(notepads));
    const setGame = (game: Game) => dispatch(actionCreators.updateGame(game));

    firebase.listenForGameChanges(gameCode, setPlayers, setNotepads, setGame);
};
