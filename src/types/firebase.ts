export interface FirebasePlayer {
    uid: string;
    name: string;
    photoUrl: string;
}

export interface LobbyGame {
    created: number;
    gameCode: string;
    players: string[];
}
