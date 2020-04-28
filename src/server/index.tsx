import React from "react";

import BirdsEye from "../server/BirdsEye";
import LoadingScreen from "../server/LoadingScreen";
import History from "../server/History";
import PlayerStream from "../server/PlayerStream";
import GameCodeScreen from "../server/GameCodeScreen";
import {GameState} from "../utils/store";
import {useReduxState} from "../utils/hooks";
import LoginScreen from "../components/LoginScreen";

export default function Server() {
    const {client: {gameState, activePlayerId}} = useReduxState();

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
            return <History ownerId={activePlayerId} />;
        case GameState.PLAYER_HISTORY:
            return <History playerId={activePlayerId} />;
        case GameState.SINGLE_PLAYER:
            return <PlayerStream playerId={activePlayerId} />;
        default:
            return <div />;
    }
};
