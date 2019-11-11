import React, {useContext} from "react";
import {Drawing, TitleScreen, Typing, Waiting} from "./components";
import {ClientGameState} from "../types/client";
import Store, {GameContext} from "./Store";
import {init} from "./socket-io";

export default function App() {
    const [{state}] = useContext(GameContext);
    init();
    
    const getScreen = () => {
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
    };
    
    return (<Store>
        {getScreen()}
    </Store>)
}
