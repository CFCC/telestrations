import * as React from "react";
import _ from "lodash";

import TitleScreen from "../components/TitleScreen";
import { useSelector } from "../utils/store";
import Drawing from "./Drawing";
import Typing from "./Typing";
import Waiting from "./Waiting";
import LoginScreen from "../components/LoginScreen";
import GameSelection from "./GameSelection";
import { GameState } from "../utils/types";

export default function Client() {
  const gameState = useSelector((state) => state.app.gameState);
  const userId = useSelector((state) => state.gamekit.settings.id);
  const players = useSelector((state) => state.gamekit.currentGame.players);

  switch (gameState) {
    case GameState.LOGIN:
      return <LoginScreen />;
    case GameState.GAME_CODE:
      return <GameSelection />;
    case GameState.WAITING_TO_START:
      return (
        <TitleScreen
          title="Waiting for the game to start"
          subtitle="Have your host start the game when everyone's joined!"
          loading={true}
        />
      );
    case GameState.FINISHED:
      return (
        <TitleScreen
          title="The game is finished!"
          subtitle="Please ask your host to see the results."
        />
      );
    case GameState.IN_GAME: {
      if (!userId) return <div />;

      const player = players.find((p) => p.id === userId);
      if (!player) return <div />;

      const currentNotepad = player.notebookQueue[0];
      if (!currentNotepad) return <div />;

      const numPages =
        _.last(currentNotepad?.pages)?.authorId === userId
          ? currentNotepad?.pages.length
          : currentNotepad?.pages.length + 1;

      return (numPages ?? 0) % 2 === 1 ? <Typing /> : <Drawing />;
    }
    case GameState.WAITING_FOR_CONTENT:
      return <Waiting />;
    default:
      return <div />;
  }
}
