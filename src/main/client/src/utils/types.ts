import { Game, Player } from "@piticent123/gamekit-client/lib/types";

export interface Page {
  type: "image" | "text";
  authorId: string;
  content: string;
  id: string;
}

export interface Notebook {
  originalOwnerId: string;
  pages: Page[];
}

export interface TelestrationsPlayer extends Player {
  notebookQueue: Notebook[];
}

export interface TelestrationsGame extends Game<TelestrationsPlayer> {
  isDone: boolean;
}

export enum GameState {
  // Common
  LOGIN = "login",
  GAME_CODE = "game code",
  WAITING_TO_START = "waiting to start",

  // Server
  BIRDS_EYE = "bird's eye",
  SINGLE_PLAYER = "single player",
  PLAYER_HISTORY = "player history",
  NOTEPAD_HISTORY = "notepad history",

  // Client
  IN_GAME = "in game",
  FINISHED = "finished",
  WAITING_FOR_CONTENT = "waiting for content",
}
