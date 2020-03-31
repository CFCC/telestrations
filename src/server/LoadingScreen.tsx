import React, {useContext} from "react";
import {Button, Typography} from "@material-ui/core";
import styled from "styled-components";

import {GameContext} from "../store/server";
import TitleScreen from "../components/TitleScreen";

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
    const [{players, gameCode}, {startGame}] = useContext(GameContext);

    return (
        <TitleScreen
            title="Waiting for clients to connect"
            subtitle={`Tell people to select game "${gameCode}"`}
        >
            <PlayerList>
                {players.map((player, i) => (
                    <PlayerLabel key={i}>
                        {player.nickname}
                    </PlayerLabel>
                ))}
            </PlayerList>
            <Button
                onClick={startGame}
                variant="contained"
                color="primary"
                disabled={players.length < 2}
                size="large"
            >
                Start Game
            </Button>
        </TitleScreen>
    );
};

