import * as React from "react";
import {useContext} from "react";

import {ClientGameState} from "types/client";
import TitleScreen from "components/TitleScreen";
import {GameContext} from "client/Store";
import Drawing from "client/Drawing";
import Typing from "client/Typing";
import Waiting from "client/Waiting";
import LoginScreen from "client/LoginScreen";
import GameSelection from "./GameSelection";

export default function Client() {
    const [{state}] = useContext(GameContext);

    switch (state) {
        case ClientGameState.LOGIN:
            return <LoginScreen />;
        case ClientGameState.GAME_SELECTION:
            return <GameSelection />;
        case ClientGameState.ALREADY_STARTED:
            return <TitleScreen
                title="This game's already started!"
                subtitle="Wait for it to finish before joining."
            />;
        case ClientGameState.WAITING_TO_START:
            return <TitleScreen
                title="Waiting for the game to start"
                subtitle="Have your host start the game when everyone's joined!"
                loading={true}
            />;
        case ClientGameState.FINISHED:
            return <TitleScreen
                title="The game is finished!"
                subtitle="Please ask your host to see the results."
            />;
        case ClientGameState.DRAWING:
            return <Drawing />;
        case ClientGameState.TYPING:
            return <Typing />;
        case ClientGameState.WAITING_FOR_CONTENT:
            return <Waiting />;
        default:
            return <div />;
    }
}
