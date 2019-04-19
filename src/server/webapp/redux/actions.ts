import {ClientGameState} from "../../../types";

export type SET_GAME_STATE = 'CONFIG_SET_GAME_STATE';
export const SET_GAME_STATE: SET_GAME_STATE = 'CONFIG_SET_GAME_STATE';
export interface setGameState {
    type: SET_GAME_STATE;
    state: ClientGameState;
}
export function setGameState(state: ClientGameState): setGameState {
    return {
        type: SET_GAME_STATE,
        state
    };
}

export type Creator = setGameState;