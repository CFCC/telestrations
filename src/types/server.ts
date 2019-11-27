import {ContentType, UUID} from "types/shared";

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
