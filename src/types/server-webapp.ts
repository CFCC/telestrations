import {ChangeEvent} from "react";

export enum ServerWebAppGameState {
    LOADING = 'loading',
    BIRDS_EYE = 'bird\'s eye',
    SINGLE_PLAYER = 'single player',
    PLAYER_HISTORY = 'player history',
    NOTEPAD_HISTORY = 'notepad history'
}

export type Event = ChangeEvent<HTMLInputElement>;