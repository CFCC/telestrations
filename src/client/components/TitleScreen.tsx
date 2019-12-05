import React, {ChangeEvent, FormEvent, useContext, useEffect} from "react";
import {Button, CircularProgress, TextField, Typography} from "@material-ui/core";
import {ClientGameState} from "types/client";
import {GameContext} from "client/Store";
import {darkPrimary, primary} from "utils/theme";
import styled from "styled-components";

const Container = styled.div`
    background: linear-gradient(180deg, ${primary} 50%, ${darkPrimary} 100%);
    display: flex;
    align-items: center;
    flex-direction: column;
    height: 100vh;
    overflow: auto;
`;

const Progress = styled(CircularProgress)`
    margin: 1rem;
    width: 3rem;
    height: 3rem;
`;

const Image = styled.img`
    max-width: 50%;
    margin: 1rem;
`;

const Input = styled(TextField)`
    margin-bottom: 1rem;
`;

const Header = styled(Typography)`
    text-align: center;
    font-size: 2rem;
    margin: 1rem;
    font-weight: bold;
`;

export default function TitleScreen() {
    const [{state, nickname, nicknameSubmitted}, {submitNickname, setNickname, init}] = useContext(GameContext);

    useEffect(() => {
        if (state === ClientGameState.LOADING && !nicknameSubmitted) init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submitNicknameEl = <React.Fragment>
        <Header>What is your name?</Header>
        <Input
            value={nickname}
            variant="outlined"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)} />
        <Button variant="contained" color="primary" type="submit" size="large">Join Game</Button>
    </React.Fragment>;

    const waitForGameToStart = <React.Fragment>
        <Header>Waiting for the game to start</Header>
        <Typography>Have your host start the game when everyone's joined!</Typography>
        <Progress />
    </React.Fragment>;

    const gameAlreadyStarted = <React.Fragment>
        <Header>This game's already started!</Header>
        <Typography>Wait for it to finish before joining.</Typography>
    </React.Fragment>;

    const gameFinished = <React.Fragment>
        <Header>The game is finished!</Header>
        <Typography>Please ask your host to see the results.</Typography>
    </React.Fragment>;

    const getContent = () => {
        switch (state) {
            case ClientGameState.LOADING:
                return nicknameSubmitted ? waitForGameToStart : submitNicknameEl;
            case ClientGameState.FINISHED:
                return gameFinished;
            case ClientGameState.ALREADY_STARTED:
            default:
                return gameAlreadyStarted;
        }
    };

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        submitNickname();
        return false;
    };

    return (<form onSubmit={onSubmit}>
        <Container>
            <Image src="/logo.png" alt="Telestrations logo" />
            {getContent()}
        </Container>
    </form>);
}
