import React, {useContext} from "react";
import {BirdsEye, LoadingScreen, PlayerStream, History} from "server/webapp/components";
import {ServerWebAppGameState} from "types/server-webapp";
import Store, {GameContext} from "server/webapp/Store";

export default function App() {
    const [{state, activePlayerId}] = useContext(GameContext);

    const getScreen = () => {
        switch (state) {
            case ServerWebAppGameState.LOADING: return <LoadingScreen />;
            case ServerWebAppGameState.BIRDS_EYE: return <BirdsEye />;
            case ServerWebAppGameState.NOTEPAD_HISTORY: return <History />;
            case ServerWebAppGameState.PLAYER_HISTORY: return <History />;
            case ServerWebAppGameState.SINGLE_PLAYER: return <PlayerStream playerId={activePlayerId} />;
            default: return <div />;
        }
    };

    return (<Store>
        {getScreen()}
    </Store>);
}
