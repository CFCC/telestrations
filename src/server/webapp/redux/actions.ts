import {ServerWebAppGameState} from "../../../types";

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

export type Creator = setGameState;