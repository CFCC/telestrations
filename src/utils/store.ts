import {configureStore, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useSelector as useUntypedSelector} from "react-redux";
import {User} from "firebase/app";

import {Game, Notepad, Player} from "./firebase";

export enum GameState {
    // Common
    LOGIN = "login",
    GAME_CODE = "game code",

    // Server
    LOADING = "loading",
    BIRDS_EYE = "bird's eye",
    SINGLE_PLAYER = "single player",
    PLAYER_HISTORY = "player history",
    NOTEPAD_HISTORY = "notepad history",

    // Client
    WAITING_TO_START = "waiting to start",
    IN_GAME = "in game",
    FINISHED = "finished",
    ALREADY_STARTED = "already started",
    WAITING_FOR_CONTENT = "waiting for content",
}

export const firebaseSlice = createSlice({
    name: "firebase",
    initialState: {
        game: {
            id: "",
            created: new Date().getTime(),
            status: "lobby",
            serverId: "",
        },
        players: {},
        notepads: {},
    },
    reducers: {
        updateGame: (state, action: PayloadAction<Partial<Game>>) => {
            state.game = {...state.game, ...action.payload};
        },
        updateNotepads: (state, action: PayloadAction<Record<string, Notepad>>) => {
            state.notepads = action.payload;
        },
        updatePlayers: (state, action: PayloadAction<Record<string, Player>>) => {
            state.players = action.payload;
        }
    }
});
export const clientSlice = createSlice({
    name: "client",
    initialState: {
        user: null as User | null,
        gameState: GameState.LOGIN,
        activePlayerId: "",
    },
    reducers: {
        viewPlayerHistory: (state, action: PayloadAction<string>) => {
            state.gameState = GameState.PLAYER_HISTORY;
            state.activePlayerId = action.payload;
        },
        viewNotepadHistory: (state, action: PayloadAction<string>) => {
            state.gameState = GameState.NOTEPAD_HISTORY;
            state.activePlayerId = action.payload;
        },
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            state.gameState = GameState.GAME_CODE;
        },
        setGameState: (state, action: PayloadAction<GameState>) => {
            state.gameState = action.payload;
        }
    },
    extraReducers: builder => builder
});

export const store = configureStore({
    reducer: {
        firebase: firebaseSlice.reducer,
        client: clientSlice.reducer
    }
});

export const useSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useUntypedSelector;
