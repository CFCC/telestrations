import React, {useContext, useEffect} from "react";
import {v4 as uuid} from "uuid";

import {GameContext} from "../store/server";
import BirdsEye from "../server/BirdsEye";
import LoadingScreen from "../server/LoadingScreen";
import History from "../server/History";
import PlayerStream from "../server/PlayerStream";
import GameCodeScreen from "../server/GameCodeScreen";
import {ServerGameState} from "../types/server";

export default function Server() {
    const [{gameState, activePlayerId}] = useContext(GameContext);

    useEffect(() => {
        let serverId = localStorage.getItem('serverId');
        if (!serverId) {
            serverId = uuid();
            localStorage.setItem('serverId', serverId);
        }
    }, []);

    switch (gameState) {
        case ServerGameState.GAME_CODE:
            return <GameCodeScreen />;
        case ServerGameState.LOADING:
            return <LoadingScreen />;
        case ServerGameState.BIRDS_EYE:
            return <BirdsEye />;
        case ServerGameState.NOTEPAD_HISTORY:
            return <History ownerId={activePlayerId} />;
        case ServerGameState.PLAYER_HISTORY:
            return <History playerId={activePlayerId} />;
        case ServerGameState.SINGLE_PLAYER:
            return <PlayerStream playerId={activePlayerId} />;
        default:
            return <div />;
    }
};
