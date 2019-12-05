import React, {useContext} from "react";
import {GameContext} from "./Store";
import {ServerWebAppGameState} from "../../types/server-webapp";
import {BirdsEye, History, LoadingScreen, PlayerStream} from "./components";

export default function ServerWebapp() {
    const [{state, activePlayerId}] = useContext(GameContext);

    switch (state) {
        case ServerWebAppGameState.LOADING: return <LoadingScreen />;
        case ServerWebAppGameState.BIRDS_EYE: return <BirdsEye />;
        case ServerWebAppGameState.NOTEPAD_HISTORY: return <History ownerId={activePlayerId} />;
        case ServerWebAppGameState.PLAYER_HISTORY: return <History playerId={activePlayerId} />;
        case ServerWebAppGameState.SINGLE_PLAYER: return <PlayerStream playerId={activePlayerId} />;
        default: return <div />;
    }
};

