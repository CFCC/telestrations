import {GameState, UUID} from '../../types';

export type SET_GAME_STATE = 'SET_GAME_STATE';
export const SET_GAME_STATE: SET_GAME_STATE = 'SET_GAME_STATE';
export interface setGameState {
    type: SET_GAME_STATE;
    state: GameState;
}
export function setGameState(state: GameState): setGameState {
    return {
        type: SET_GAME_STATE,
        state
    };
}

export type SET_NICKNAME = 'SET_NICKNAME';
export const SET_NICKNAME: SET_NICKNAME = 'SET_NICKNAME';
export interface setNickname {
    type: SET_NICKNAME;
    nickname: String;
}
export function setNickname(nickname: String): setNickname {
    return {
        type: SET_NICKNAME,
        nickname
    }
}

export type SUBMIT_NICKNAME = 'SUBMIT_NICKNAME';
export const SUBMIT_NICKNAME: SUBMIT_NICKNAME = 'SUBMIT_NICKNAME';
export interface submitNickname {
    type: SUBMIT_NICKNAME;
}
export function submitNickname(): submitNickname {
    return {
        type: SUBMIT_NICKNAME
    };
}

export type FINISH_TURN = 'FINISH_TURN';
export const FINISH_TURN: FINISH_TURN = 'FINISH_TURN';
export interface finishTurn {
    type: FINISH_TURN;
    personId: UUID;
    content: string;
}
export function finishTurn(personId: UUID, content: string): finishTurn {
    return {
        type: FINISH_TURN,
        personId,
        content
    };
}

export type Action = FINISH_TURN | SET_GAME_STATE | SET_NICKNAME | SUBMIT_NICKNAME;
export const Action = {
    FINISH_TURN, SET_GAME_STATE, SET_NICKNAME, SUBMIT_NICKNAME
};

export type Creator = finishTurn | setGameState | setNickname | submitNickname;
export const Creator = {
    finishTurn, setGameState, setNickname, submitNickname
};