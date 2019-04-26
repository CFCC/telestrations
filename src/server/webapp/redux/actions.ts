import {ServerWebAppGameState, UUID} from "../../../types";

export type SET_GAME_STATE = 'CONFIG_SET_GAME_STATE';
export const SET_GAME_STATE: SET_GAME_STATE = 'CONFIG_SET_GAME_STATE';
export interface setGameState {
    type: SET_GAME_STATE;
    state: ServerWebAppGameState;
}
export function setGameState(state: ServerWebAppGameState): setGameState {
    return {
        type: SET_GAME_STATE,
        state
    };
}

export type VIEW_PLAYER_HISTORY = 'VIEW_PLAYER_HISTORY';
export const VIEW_PLAYER_HISTORY: VIEW_PLAYER_HISTORY = 'VIEW_PLAYER_HISTORY';
export interface viewPlayerHistory {
    type: VIEW_PLAYER_HISTORY;
    playerId: UUID;
}
export function viewPlayerHistory(playerId: UUID): viewPlayerHistory {
    return {
        type: VIEW_PLAYER_HISTORY,
        playerId
    };
}

export type VIEW_NOTEPAD_HISTORY = 'VIEW_PLAYER_HISTORY';
export const VIEW_NOTEPAD_HISTORY: VIEW_PLAYER_HISTORY = 'VIEW_PLAYER_HISTORY';
export interface viewNotepadHistory {
    type: VIEW_NOTEPAD_HISTORY;
    ownerId: UUID;
}
export function viewNotepadHistory(ownerId: UUID): viewNotepadHistory {
    return {
        type: VIEW_NOTEPAD_HISTORY,
        ownerId
    };
}

export type Action = setGameState | viewPlayerHistory | viewNotepadHistory;