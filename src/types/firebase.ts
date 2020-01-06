interface Collection<T> {
    [id: string]: T;
}

export interface LobbyGame {
    created: number;
    gameCode: string;
    players: string[];
}

export interface Notepad {
    ownerId: string;
}

export interface Player {
    notepadId: string;
    currentIndex: number;
}

export interface Game {
    notepads: Collection<Notepad>;
    players: Collection<Player>;
}
