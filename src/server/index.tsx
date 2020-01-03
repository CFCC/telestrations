import React, {useContext} from "react";

import {GameContext} from "server/Store";
import BirdsEye from "server/BirdsEye";
import LoadingScreen from "server/LoadingScreen";
import History from "server/History";
import PlayerStream from "server/PlayerStream";
import GameCodeScreen from "server/GameCodeScreen";
import {ServerGameState} from "types/server";

export default function ServerWebapp() {
    const [{state, activePlayerId}] = useContext(GameContext);

    switch (state) {
        case ServerGameState.GAME_CODE: return <GameCodeScreen />;
        case ServerGameState.LOADING: return <LoadingScreen />;
        case ServerGameState.BIRDS_EYE: return <BirdsEye />;
        case ServerGameState.NOTEPAD_HISTORY: return <History ownerId={activePlayerId} />;
        case ServerGameState.PLAYER_HISTORY: return <History playerId={activePlayerId} />;
        case ServerGameState.SINGLE_PLAYER: return <PlayerStream playerId={activePlayerId} />;
        default: return <div />;
    }
};

