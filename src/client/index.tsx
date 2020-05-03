import * as React from "react";
import _ from "lodash";

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
            if (!user.uid) return <div />;

            const player = players[user.uid];
            if (!player) return <div />;

            const currentNotepad = notepads[player.currentNotepad];
            if (!currentNotepad) return <div />;

            const numPages = _.last(currentNotepad?.pages)?.author === user.uid
                ? currentNotepad?.pages.length
                : currentNotepad?.pages.length + 1;

            console.log(currentNotepad.pages, user.uid, numPages);
            return (numPages ?? 0) % 2 === 1 ? <Typing /> : <Drawing />;
        }
        case GameState.WAITING_FOR_CONTENT:
            return <Waiting />;
        default:
            return <div />;
    }
}
