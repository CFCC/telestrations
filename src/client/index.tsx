import * as React from "react";
import {useContext} from "react";
import {GameContext} from "./Store";
import {ClientGameState} from "../types/client";
import TitleScreen from "./TitleScreen";
import Drawing from "./Drawing";
import Typing from "./Typing";
import Waiting from "./Waiting";

export default function Client() {
    const [{state}] = useContext(GameContext);

    switch (state) {
        case ClientGameState.ALREADY_STARTED:
        case ClientGameState.LOADING:
        case ClientGameState.FINISHED:
            return <TitleScreen />;
        case ClientGameState.DRAWING:
            return <Drawing />;
        case ClientGameState.TYPING:
            return <Typing />;
        case ClientGameState.WAITING:
            return <Waiting />;
        default:
            return <div />;
    }
}
