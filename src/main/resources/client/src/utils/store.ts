import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useSelector as useUntypedSelector,
} from "react-redux";

import { Game, Notebook, Player } from "../utils/types";
import { Settings } from "./types";

interface State {
  openGames: string[];
  toast: {
    id: number;
    title: string;
    description: string;
    status: "info" | "warning" | "success" | "error";
  };
  settings: Settings;
  currentGame: Game;
}

export const { actions, reducer } = createSlice({
  name: "app",
  initialState: {
    openGames: [],
    toast: { id: 0, title: "", description: "", status: "info" },
    currentGame: {
      active: false,
      code: "",
      players: [],
      admin: "",
      round: 0,
      adminId: "",
      isDone: false,
    },
    settings: {
      id: localStorage.getItem("id"),
      avatar: localStorage.getItem("avatar"),
      name: localStorage.getItem("name"),
      connected: true,
    },
  } as State,
  reducers: {
    updateGame: (state, action: PayloadAction<Partial<WithId<Game>>>) => {
      state.game = { ...state.game, ...action.payload };
    },
    updateNotepads: (state, action: PayloadAction<Record<string, Notepad>>) => {
      state.notepads = action.payload;
    },
    updatePlayers: (state, action: PayloadAction<Record<string, Player>>) => {
      state.players = action.payload;
    },
    viewPlayerHistory: (state, action: PayloadAction<string>) => {
      state.gameState = GameState.PLAYER_HISTORY;
      state.activePlayerId = action.payload;
    },
    viewNotepadHistory: (state, action: PayloadAction<string>) => {
      state.gameState = GameState.NOTEPAD_HISTORY;
      state.activePlayerId = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.gameState = GameState.GAME_CODE;
    },
    setGameState: (state, action: PayloadAction<GameState>) => {
      state.gameState = action.payload;
    },
  },
  extraReducers: (builder) => builder,
});

export const store = configureStore({ reducer });

export const useSelector: TypedUseSelectorHook<State> = useUntypedSelector;
