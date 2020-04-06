import {UUID} from "../types/shared";
import {ServerGameState} from "../types/server";
import {Game, Notepad, Player} from "../types/firebase";

export interface State {
    gameState: ServerGameState;
    game: Game;
    gameCode: string;
    activePlayerId: UUID;
    activeNotepadId: UUID;
}

export enum ActionTypes {
    SET_GAME_CODE = "SET_GAME_CODE",
    VIEW_PLAYER_HISTORY = "VIEW_PLAYER_HISTORY",
    VIEW_NOTEPAD_HISTORY = "VIEW_NOTEPAD_HISTORY",
    START_GAME = "START_GAME",
    GAME_FINISHED = "GAME_FINISHED",
    UPDATE_GAME = "UPDATE_GAME",
    UPDATE_PLAYERS = "UPDATE_PLAYERS",
    UPDATE_NOTEPADS = "UPDATE_NOTEPADS",
}

export interface setGameCode {
    type: ActionTypes.SET_GAME_CODE;
    gameCode: string;
    setNotepads: (notepads: Record<string, Notepad>) => updateNotepads;
    setPlayers: (players: Record<string, Player>) => updatePlayers;
    gameIsNew: boolean;
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

export interface updateNotepads {
    type: ActionTypes.UPDATE_NOTEPADS;
    notepads: Record<string, Notepad>;
}

export interface updatePlayers {
    type: ActionTypes.UPDATE_PLAYERS;
    players: Record<string, Player>;
}

export type Action =
    viewPlayerHistory |
    viewNotepadHistory |
    startGame |
    gameFinished |
    setGameCode |
    updateGame |
    updateNotepads |
    updatePlayers;

export interface Actions extends Record<string, (...args: any) => Action> {
    setGameCode: (
        gameCode: string,
        setNotepads: (notepads: Record<string, Notepad>) => updateNotepads,
        setPlayers: (players: Record<string, Player>) => updatePlayers,
        gameIsNew?: boolean
    ) => setGameCode;
    viewPlayerHistory: (playerId: UUID) => viewPlayerHistory,
    viewNotepadHistory: (ownerId: UUID) => viewNotepadHistory,
    startGame: () => startGame,
    updateGame: (game: Game) => updateGame,
    updateNotepads: (notepads: Record<string, Notepad>) => updateNotepads,
    updatePlayers: (players: Record<string, Player>) => updatePlayers,
    gameFinished: () => gameFinished,
}

export type Store = [State, Actions];
