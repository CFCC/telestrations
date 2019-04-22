import {ClientGameState} from '../../types';

export type SET_GAME_STATE = 'SET_GAME_STATE';
export const SET_GAME_STATE: SET_GAME_STATE = 'SET_GAME_STATE';
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

export type SET_GUESS = 'SET_GUESS';
export const SET_GUESS: SET_GUESS = 'SET_GUESS';
export interface setGuess {
    type: SET_GUESS;
    guess: string;
}
export function setGuess(guess: string): setGuess {
    return {
        type: SET_GUESS,
        guess
    };
}

export type SUBMIT_GUESS = 'SUBMIT_GUESS';
export const SUBMIT_GUESS: SUBMIT_GUESS = 'SUBMIT_GUESS';
export interface submitGuess {
    type: SUBMIT_GUESS;
}
export function submitGuess(): submitGuess {
    return {
        type: SUBMIT_GUESS
    }
}

export type Creator = setGameState | setNickname | submitNickname | setGuess | submitGuess;