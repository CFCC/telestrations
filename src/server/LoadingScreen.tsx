import * as React from "react";
import {Button, Typography} from "@material-ui/core";
import styled from "styled-components";

import {clientSlice, GameState, useSelector} from "../utils/store";
import {startGame} from "../utils/firebase";
import TitleScreen from "../components/TitleScreen";
import {useDispatch} from "react-redux";

const PlayerList = styled.div`
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    margin: 2rem 1rem;
    width: calc(100% - 1rem);
`;

const PlayerLabel = styled(Typography)`
    flex-basis: 33%;
    flex-grow: 1;
    text-align: center;
    margin-bottom: 0.75rem;
`;

export default function LoadingScreen() {
    const dispatch = useDispatch();
    const {game: {id: gameCode}, players} = useSelector(state => state.firebase);

    function handleStartGame() {
        startGame();
        dispatch(clientSlice.actions.setGameState(GameState.BIRDS_EYE));
    }

    return (
        <TitleScreen
            title="Waiting for clients to connect"
            subtitle={`Tell people to select game "${gameCode}"`}
        >
            <PlayerList>
                {Object.values(players).map((player, i) => (
                    <PlayerLabel key={i}>
                        {player.name}
                    </PlayerLabel>
                ))}
            </PlayerList>
            <Button
                onClick={handleStartGame}
                variant="contained"
                color="primary"
                disabled={Object.values(players).length < 2}
                size="large"
            >
                Start Game
            </Button>
        </TitleScreen>
    );
};

