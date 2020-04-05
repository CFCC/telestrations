import {UUID} from "../types/shared";
import {ServerGameState} from "../types/server";
import {Game} from "../types/firebase";

export interface State {
    gameState: ServerGameState;
    gameCode: string;
    game?: Game;
    activePlayerId: UUID;
    activeNotepadId: UUID;
}

export enum ActionTypes {
    SET_GAME_CODE = "SET_GAME_CODE",
    SET_SERVER_ID = "SET_SERVER_ID",
    VIEW_PLAYER_HISTORY = "VIEW_PLAYER_HISTORY",
    VIEW_NOTEPAD_HISTORY = "VIEW_NOTEPAD_HISTORY",
    START_GAME = "START_GAME",
    GAME_FINISHED = "GAME_FINISHED",
    UPDATE_GAME = "UPDATE_GAME",
}

export interface setGameCode {
    type: ActionTypes.SET_GAME_CODE;
    gameCode: string;
}

export interface viewPlayerHistory {
    type: ActionTypes.VIEW_PLAYER_HISTORY;
    playerId: UUID;
}

export interface viewNotepadHistory {
    type: ActionTypes.VIEW_NOTEPAD_HISTORY;
    ownerId: UUID;
}

export interface startGame {
    type: ActionTypes.START_GAME;
}

export interface gameFinished {
    type: ActionTypes.GAME_FINISHED;
}

export interface updateGame {
    type: ActionTypes.UPDATE_GAME;
    game: Game;
}

export type Action =
    viewPlayerHistory |
    viewNotepadHistory |
    startGame |
    gameFinished |
    setGameCode |
    updateGame;

export interface Actions extends Record<string, (...args: any) => Action> {
    setGameCode: (gameCode: string) => setGameCode;
    viewPlayerHistory: (playerId: UUID) => viewPlayerHistory,
    viewNotepadHistory: (ownerId: UUID) => viewNotepadHistory,
    startGame: () => startGame,
    updateGame: (game: Game) => updateGame,
    gameFinished: () => gameFinished,
}

export type Store = [State, Actions];
