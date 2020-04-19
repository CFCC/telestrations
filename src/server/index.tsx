import React, {useEffect} from "react";
import {v4 as uuid} from "uuid";

import BirdsEye from "../server/BirdsEye";
import LoadingScreen from "../server/LoadingScreen";
import History from "../server/History";
import PlayerStream from "../server/PlayerStream";
import GameCodeScreen from "../server/GameCodeScreen";
import {GameState} from "../utils/store";
import {useReduxState} from "../utils/hooks";

export default function Server() {
    const {client: {gameState, activePlayerId}} = useReduxState();

    useEffect(() => {
        if (!localStorage.getItem('serverId')) {
            localStorage.setItem('serverId', uuid());
        }
    }, []);

    switch (gameState) {
        case GameState.GAME_CODE:
            return <GameCodeScreen />;
        case GameState.LOADING:
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
