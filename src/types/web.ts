export enum ServerGameState {
    GAME_CODE = "game code",
    LOADING = "loading",
    BIRDS_EYE = "bird's eye",
    SINGLE_PLAYER = "single player",
    PLAYER_HISTORY = "player history",
    NOTEPAD_HISTORY = "notepad history"
}

export enum ClientGameState {
    GAME_SELECTION = "game selection",
    LOGIN = "login",
    WAITING_TO_START = "waiting to start",
    IN_GAME = "in game",
    FINISHED = "finished",
    ALREADY_STARTED = "already started",
    WAITING_FOR_CONTENT = "waiting for content"
}
