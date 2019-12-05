import React, {useContext, useEffect} from "react";
import {Button, Typography} from "@material-ui/core";
import styled from "styled-components";
import {GameContext} from "server/webapp/Store";
import {darkPrimary, primary} from "utils/theme";

const Container = styled.div`
    background: linear-gradient(180deg; ${primary} 50%; ${darkPrimary} 100%);
    display: flex;
    align-items: center;
    flex-direction: column;
    height: 100vh;
    overflow: auto;
`;

const Image = styled.img`
    max-width: 50%;
    margin: 1rem;
`;

const Header = styled(Typography)`
    text-align: center;
    font-size: 2rem;
    margin: 1rem;
    font-weight: bold;
`;

const SubHeader = styled(Typography)`
    font-style: italic;   
`;

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
    const [{players}, {init, startGame}] = useContext(GameContext);

    useEffect(() => {
        init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (<Container>
        <Image src="/logo.png" alt="Telestrations logo" />
        <Header>Waiting for clients to connect</Header>
        <SubHeader>Start the game when everyone's joined!</SubHeader>
        <PlayerList>
            {players.map((player, i) => (<PlayerLabel key={i}>
                {player.nickname}
            </PlayerLabel>))}
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
    </Container>);
};

