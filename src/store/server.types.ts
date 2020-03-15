import { UUID } from "types/shared";
import { ServerGameState, ServerPlayer, PlayerDTO, NotepadPageDTO } from "types/server";
import { Notepad } from "types/client";

export interface State extends Record<string, any> {
    gameState: ServerGameState;
    gameCode: string;
    serverId: UUID;
    players: Array<ServerPlayer>;
    notepads: Array<Notepad>;
    activePlayerId: UUID;
    activeNotepadId: UUID;
}

export enum ActionTypes {
    SET_GAME_CODE = "SET_GAME_CODE",
    SET_SERVER_ID = "SET_SERVER_ID",
    VIEW_PLAYER_HISTORY = "VIEW_PLAYER_HISTORY",
    VIEW_NOTEPAD_HISTORY = "VIEW_NOTEPAD_HISTORY",
    START_GAME = "START_GAME",
    PLAYER_ADDED = "PLAYER_ADDED",
    UPDATE_GUESS = "UPDATE_GUESS",
    NEW_NOTEPAD = "NEW_NOTEPAD",
    FINISHED_GAME_TURN = "FINISHED_GAME_TURN",
    GAME_FINISHED = "GAME_FINISHED",
}

export interface setGameCode {
    type: ActionTypes.SET_GAME_CODE;
    gameCode: string;
}

export interface setServerId {
    type: ActionTypes.SET_SERVER_ID;
    serverId: UUID;
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

export interface addPlayer {
    type: ActionTypes.PLAYER_ADDED;
    player: PlayerDTO;
}

export interface updateGuess {
    type: ActionTypes.UPDATE_GUESS;
    playerId: UUID;
    content: string;
}

export interface finishedGameTurn {
    type: ActionTypes.FINISHED_GAME_TURN;
    playerId: UUID;
}

export interface gameFinished {
    type: ActionTypes.GAME_FINISHED;
}

export interface newNotepad {
    type: ActionTypes.NEW_NOTEPAD;
    playerId: UUID;
    newNotepadOwnerId: UUID;
}

export type Action = viewPlayerHistory | viewNotepadHistory | startGame | addPlayer | updateGuess
    | finishedGameTurn | gameFinished | newNotepad | setServerId | setGameCode;

export interface Actions extends Record<string, (...args: any) => Action> {
    setGameCode: (gameCode: string) => setGameCode;
    viewPlayerHistory: (playerId: UUID) => viewPlayerHistory,
    viewNotepadHistory: (ownerId: UUID) => viewNotepadHistory,
    startGame: () => startGame,
    addPlayer: (player: PlayerDTO) => addPlayer,
    updateGuess: (page: NotepadPageDTO) => updateGuess,
    finishedGameTurn: (playerId: UUID, newNotepadOwnerId: UUID) => finishedGameTurn,
    gameFinished: () => gameFinished,
}

export type Store = [State, Actions];