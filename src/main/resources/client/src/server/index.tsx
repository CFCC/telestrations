import React from "react";

import BirdsEye from "./BirdsEye";
import LoadingScreen from "./LoadingScreen";
import History from "./History";
import PlayerStream from "./PlayerStream";
import GameCodeScreen from "./GameCodeScreen";
import LoginScreen from "../components/LoginScreen";
import { GameState } from "../utils/types";
import { useSelector } from "../utils/store";

export default function Server() {
  const gameState = useSelector((state) => state.gameState);
  const activeContentId = useSelector((state) => state.activeContentId);

  switch (gameState) {
    case GameState.LOGIN:
      return <LoginScreen />;
    case GameState.GAME_CODE:
      return <GameCodeScreen />;
    case GameState.WAITING_TO_START:
      return <LoadingScreen />;
    case GameState.BIRDS_EYE:
      return <BirdsEye />;
    case GameState.NOTEPAD_HISTORY:
      return <History ownerId={activeContentId} />;
    case GameState.PLAYER_HISTORY:
      return <History playerId={activeContentId} />;
    case GameState.SINGLE_PLAYER:
      return <PlayerStream playerId={activeContentId} />;
    default:
      return <div />;
  }
}
