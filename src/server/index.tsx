import React, {useContext, Dispatch} from "react";
import uuid from 'uuid/v4';

import { GameContext } from "store/server";
import BirdsEye from "server/BirdsEye";
import LoadingScreen from "server/LoadingScreen";
import History from "server/History";
import PlayerStream from "server/PlayerStream";
import GameCodeScreen from "server/GameCodeScreen";
import { ServerGameState } from "types/server";
import { Action, ActionTypes } from "store/server.types";

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

export function init(dispatch: Dispatch<Action>) {
    let serverId = localStorage.getItem('serverId');
    if (!serverId) {
        serverId = uuid();
        localStorage.setItem('serverId', serverId);
    }

    dispatch({type: ActionTypes.SET_SERVER_ID, serverId});
}