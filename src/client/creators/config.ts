import * as configActions from '../actions/config';
import {GameState} from '../../types';

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

export interface setNickname {
    type: configActions.SET_NICKNAME;
    nickname: String;
}
export function setNickname(nickname: String): setNickname {
    return {
        type: configActions.SET_NICKNAME,
        nickname
    }
}

export interface submitNickname {
    type: configActions.SUBMIT_NICKNAME;
}
export function submitNickname(): submitNickname {
    return {
        type: configActions.SUBMIT_NICKNAME
    };
}

export type ConfigCreator = setGameState | setNickname | submitNickname;