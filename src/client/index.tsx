import * as React from "react";

import {ClientGameState} from "../types/web";
import TitleScreen from "../components/TitleScreen";
import {useSelector} from "../store/client";
import Drawing from "../client/Drawing";
import Typing from "../client/Typing";
import Waiting from "../client/Waiting";
import LoginScreen from "../client/LoginScreen";
import GameSelection from "../client/GameSelection";

export default function Client() {
    const {gameState, currentNotepad} = useSelector(state => state);

    switch (gameState) {
        case ClientGameState.LOGIN:
            return <LoginScreen />;
        case ClientGameState.GAME_SELECTION:
            return <GameSelection />;
        case ClientGameState.ALREADY_STARTED:
            return (
                <TitleScreen
                    title="This game's already started!"
                    subtitle="Wait for it to finish before joining."
                />
            );
        case ClientGameState.WAITING_TO_START:
            return (
                <TitleScreen
                    title="Waiting for the game to start"
                    subtitle="Have your host start the game when everyone's joined!"
                    loading={true}
                />
            );
        case ClientGameState.FINISHED:
            return (
                <TitleScreen
                    title="The game is finished!"
                    subtitle="Please ask your host to see the results."
                />
            );
        case ClientGameState.IN_GAME:
            return currentNotepad?.pages.length ?? 0 % 2 === 1 ? <Typing /> : <Drawing />;
        case ClientGameState.WAITING_FOR_CONTENT:
            return <Waiting />;
        default:
            return <div />;
    }
}
