import {ChangeEvent} from "react";

import {ContentType, UUID} from "./shared";

export interface NewContentDTO {
    content: string;
    type: ContentType;
}

export interface PlayerDTO {
    id: UUID;
    nickname: string;
}

export interface ServerPlayer {
    id: UUID;
    nickname: string;
    queueOfOwners: Array<UUID>;
    notepadIndex: number;
    ownerOfCurrentNotepad: UUID;
}

export interface NotepadPageDTO {
    playerId: UUID;
    content: string;
}

export interface FinishedGameTurnDTO {
    playerId: UUID;
    newNotepadOwnerId: UUID;
}

export enum ServerGameState {
    GAME_CODE = "game code",
    LOADING = "loading",
    BIRDS_EYE = "bird's eye",
    SINGLE_PLAYER = "single player",
    PLAYER_HISTORY = "player history",
    NOTEPAD_HISTORY = "notepad history"
}

export type Event = ChangeEvent<HTMLInputElement>;
