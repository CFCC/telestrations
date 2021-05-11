import {
  configureStore,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useSelector as useUntypedSelector,
} from "react-redux";

import * as api from "./api";
import { Game, GameState, Settings } from "./types";

interface State {
  gameState: GameState;
  openGames: string[];
  toast: {
    id: number;
    title: string;
    description: string;
    status: "info" | "warning" | "success" | "error";
  };
  settings: Settings;
  currentGame: Game;
  activeContentId: string;
}
interface ThunkApi {
  state: State;
}

export const goToLobby = createAsyncThunk<void, void, ThunkApi>(
  "goToLobby",
  (_, { getState }) => {
    const { settings } = getState();
    api.connectToServer(settings.id);
  }
);

export const createAndJoinGame = createAsyncThunk<void, string, ThunkApi>(
  "createGame",
  async (code, { getState }) => {
    const { settings } = getState();
    await api.createGame(code);
    await api.joinGame(code, settings);
  }
);

export const joinGame = createAsyncThunk<void, string, ThunkApi>(
  "joinGame",
  async (code, { getState }) => {
    const { settings } = getState();
    await api.joinGame(code, settings);
  }
);

export const rejoinGame = createAsyncThunk<void, string, ThunkApi>(
  "rejoinGame",
  async (code, { getState }) => {
    if (!code) return;

    const { settings } = getState();
    await api.joinGame(code, settings, true);
  }
);

export const saveSettings = createAsyncThunk<
  Partial<Settings>,
  Partial<Settings>,
  ThunkApi
>("saveSettings", (settings, { getState }) => {
  const {
    currentGame: { code },
    settings: oldSettings,
  } = getState();

  api.updateSettings(code, { ...oldSettings, ...settings });
  Object.entries(settings).forEach(([k, v]) => {
    if (!v) return;
    localStorage.setItem(k, v.toString());
  });

  return settings;
});

export const setGuess = createAsyncThunk<void, string, ThunkApi>(
  "setGuess",
  async (content, { getState }) => {
    const { currentGame } = getState();
    await api.setGuess(currentGame.code, content);
  }
);

export const submitGuess = createAsyncThunk<void, string, ThunkApi>(
  "submitGuess",
  async (content, { getState }) => {
    const { currentGame } = getState();
    await api.submitGuess(currentGame.code, content);
  }
);

export const startGame = createAsyncThunk<void, string, ThunkApi>(
  "startGame",
  async (gameCode) => {}
);

export const { actions, reducer } = createSlice({
  name: "app",
  initialState: {
    gameState: GameState.LOGIN,
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
    activeContentId: "",
  } as State,
  reducers: {
    handleRequestException: (state, action: PayloadAction<string>) => {
      state.toast = {
        id: state.toast.id + 1,
        title: "Bad Request",
        description: action.payload,
        status: "error",
      };
    },
    handleServerException: (state, action: PayloadAction<string>) => {
      state.toast = {
        id: state.toast.id + 1,
        title: "Server Error",
        description: action.payload,
        status: "error",
      };
    },
    handleSuccess: (state, action: PayloadAction<string>) => {
      state.toast = {
        id: state.toast.id + 1,
        title: "",
        description: action.payload,
        status: "success",
      };
    },
    handleGamesListMessage: (state, action: PayloadAction<string[]>) => {
      state.openGames = [...action.payload];
    },
    handleGameUpdate: (state, action: PayloadAction<Game>) => {
      state.currentGame = action.payload;
    },
    viewPlayerHistory: (state, action: PayloadAction<string>) => {
      state.gameState = GameState.PLAYER_HISTORY;
      state.activeContentId = action.payload;
    },
    viewNotepadHistory: (state, action: PayloadAction<string>) => {
      state.gameState = GameState.NOTEPAD_HISTORY;
      state.activeContentId = action.payload;
    },
    setGameState: (state, action: PayloadAction<GameState>) => {
      state.gameState = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveSettings.fulfilled, (state, action) => {
        state.settings = {
          ...state.settings,
          ...action.payload,
        };
      })
      .addCase(rejoinGame.fulfilled, (state, action) => {
        state.gameState = GameState.IN_GAME;
      });
  },
});

export const store = configureStore({ reducer });

export const useSelector: TypedUseSelectorHook<State> = useUntypedSelector;
