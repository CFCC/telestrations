import * as configActions from '../actions/config';
import {GameState} from '../../../../types';

export interface setGameState {
    type: configActions.SET_GAME_STATE;
    state: GameState;
}
export function setGameState(state: GameState): setGameState {
    return {
        type: configActions.SET_GAME_STATE,
        state
    };
}

export type ConfigCreator = setGameState;