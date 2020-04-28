import * as React from "react";

import TitleScreen from "../components/TitleScreen";
import {GameState} from "../utils/store";
import Drawing from "../client/Drawing";
import Typing from "../client/Typing";
import Waiting from "../client/Waiting";
import LoginScreen from "../components/LoginScreen";
import GameSelection from "../client/GameSelection";
import {useReduxState} from "../utils/hooks";

export default function Client() {
    const {client: {gameState, user}, firebase: {players, notepads}} = useReduxState();

    switch (gameState) {
        case GameState.LOGIN:
            return <LoginScreen />;
        case GameState.GAME_CODE:
            return <GameSelection />;
        case GameState.ALREADY_STARTED:
            return (
                <TitleScreen
                    title="This game's already started!"
                    subtitle="Wait for it to finish before joining."
                />
            );
        case GameState.WAITING_TO_START:
            return (
                <TitleScreen
                    title="Waiting for the game to start"
                    subtitle="Have your host start the game when everyone's joined!"
                    loading={true}
                />
            );
        case GameState.FINISHED:
            return (
                <TitleScreen
                    title="The game is finished!"
                    subtitle="Please ask your host to see the results."
                />
            );
        case GameState.IN_GAME: {
            if (!user) return <div />;
            const currentNotepad = notepads[players[user.uid].currentNotepad];
            return currentNotepad?.pages.length ?? 0 % 2 === 1 ? <Typing /> : <Drawing />;
        }
        case GameState.WAITING_FOR_CONTENT:
            return <Waiting />;
        default:
            return <div />;
    }
}
