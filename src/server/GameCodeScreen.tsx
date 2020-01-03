import React, {useContext} from "react";
import {Button, TextField} from "@material-ui/core";

import {GameContext} from "server/Store";
import TitleScreen from "components/TitleScreen";
import {useEvent} from "utils/hooks";
import {ServerGameState} from "types/server";

export default function LoadingScreen() {
    const [, {setGameCode, setGameState}] = useContext(GameContext);
    const [gameCode, updateGameCode] = useEvent('', ({target: {value}}) => value);

    function submitGameCode() {
        setGameCode(gameCode);
        setGameState(ServerGameState.LOADING);
    }

    return (
        <TitleScreen
            title="Please Choose a Game Code"
            subtitle="Players will select this code from the list of available games"
        >
            <form onSubmit={submitGameCode}>
                <TextField
                    value={gameCode}
                    onChange={updateGameCode}
                    label="Game Code"
                />
                <Button
                    onClick={submitGameCode}
                    variant="contained"
                    color="primary"
                    disabled={gameCode.length === 0}
                    size="large"
                >
                    Open Lobby
                </Button>
            </form>
        </TitleScreen>
    );
};

