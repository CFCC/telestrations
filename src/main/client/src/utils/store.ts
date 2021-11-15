import { createGamekitSlice, sendEvent } from "@piticent123/gamekit-client";
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

import { GameState, TelestrationsGame, TelestrationsPlayer } from "./types";
import _ from "lodash";
import { Settings } from "@piticent123/gamekit-client/lib/types";

const { reducer: gamekitReducer, actions: gamekitActions } =
  createGamekitSlice<Settings, TelestrationsPlayer, TelestrationsGame>();

interface AppState {
  gameState: GameState;
  activeContentId: string;
}
interface State {
  app: AppState;
  gamekit: ReturnType<typeof gamekitReducer>;
}
interface ThunkApi {
  state: State;
}

// This has to be at the top level to be throttled correctly
const _sendWritePageEvent = _.throttle((gameCode: string, content: string) => {
  sendEvent({
    route: `/app/games/${gameCode}/page/write`,
    data: content,
  });
}, 500);
export const setGuess = createAsyncThunk<void, string, ThunkApi>(
  "setGuess",
  async (content, { getState }) => {
    const {
      gamekit: { currentGame },
    } = getState();

    _sendWritePageEvent(currentGame.code, content);
  }
);

export const submitGuess = createAsyncThunk<void, string, ThunkApi>(
  "submitGuess",
  async (content, { getState }) => {
    const {
      gamekit: { currentGame },
    } = getState();

    sendEvent({
      route: `/app/games/${currentGame.code}/page/submit`,
      data: content,
    });
  }
);

export const startGame = createAsyncThunk<void, string, ThunkApi>(
  "startGame",
  async (__, { getState }) => {
    const {
      gamekit: { currentGame },
    } = getState();

    sendEvent({ route: `/games/${currentGame.code}/start` });
  }
);

export const {
  createGame,
  joinGame,
  rejoinGame,
  connectToServer,
  saveSettings,
  becomeAdmin,
} = gamekitActions;

const { actions, reducer: appReducer } = createSlice({
  name: "app",
  initialState: {
    gameState: GameState.LOGIN,
    activeContentId: "",
  } as AppState,
  reducers: {
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
      .addCase(gamekitActions.rejoinGame.fulfilled, (state) => {
        state.gameState = GameState.IN_GAME;
      })
      .addCase(gamekitActions.connectToServer.fulfilled, (state) => {
        state.gameState = GameState.GAME_CODE;
      })
      .addCase(gamekitActions.joinGame.fulfilled, (state) => {
        state.gameState = GameState.WAITING_TO_START;
      })
      .addCase(submitGuess.fulfilled, (state) => {
        state.gameState = GameState.WAITING_FOR_CONTENT;
      });
  },
});

export const {
  viewNotepadHistory,
  viewPlayerHistory,
  setGameState
} = actions;

export const store = configureStore({
  reducer: { gamekit: gamekitReducer, app: appReducer },
});

export const useSelector: TypedUseSelectorHook<State> = useUntypedSelector;
