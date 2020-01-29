import { UUID } from "types/shared";
import { ServerGameState, ServerPlayer, PlayerDTO, NotepadPageDTO } from "types/server";
import { Notepad } from "types/client";
import { ReactNode } from "react";

export interface State {
    state: ServerGameState;
    gameCode: string;
    serverId: UUID;
    players: Array<ServerPlayer>;
    notepads: Array<Notepad>;
    activePlayerId: UUID;
    activeNotepadId: UUID;
}

export interface StoreProps {
    children: ReactNode;
}

export enum ActionTypes {
    SET_GAME_CODE = "SET_GAME_CODE",
    SET_SERVER_ID = "SET_SERVER_ID",
    SET_GAME_STATE = "SET_GAME_STATE",
    VIEW_PLAYER_HISTORY = "VIEW_PLAYER_HISTORY",
    VIEW_NOTEPAD_HISTORY = "VIEW_NOTEPAD_HISTORY",
    INIT = "INIT",
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

export interface setGameState {
    type: ActionTypes.SET_GAME_STATE;
    state: ServerGameState;
}

export interface viewPlayerHistory {
    type: ActionTypes.VIEW_PLAYER_HISTORY;
    playerId: UUID;
}

export interface viewNotepadHistory {
    type: ActionTypes.VIEW_NOTEPAD_HISTORY;
    ownerId: UUID;
}

export interface init {
    type: ActionTypes.INIT;
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

export type Action = setGameState | viewPlayerHistory | viewNotepadHistory | init | startGame | addPlayer | updateGuess
    | finishedGameTurn | gameFinished | newNotepad | setServerId | setGameCode;

export interface Actions {
    setGameCode: (gameCode: string) => void;
    setGameState: (state: ServerGameState) => void,
    viewPlayerHistory: (playerId: UUID) => void,
    viewNotepadHistory: (ownerId: UUID) => void,
    init: () => void,
    startGame: () => void,
    addPlayer: (player: PlayerDTO) => void,
    updateGuess: (page: NotepadPageDTO) => void,
    finishedGameTurn: (playerId: UUID, newNotepadOwnerId: UUID) => void,
    gameFinished: () => void,
}

export type Store = [State, Actions];