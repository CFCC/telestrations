import React, {useContext} from "react";
import {Button as UnstyledButton, TextField} from "@material-ui/core";
import styled from "styled-components";

import {GameContext} from "store/server";
import TitleScreen from "components/TitleScreen";
import {useEvent} from "utils/hooks";
import {ServerGameState} from "types/server";

const Form = styled.form`
    width: 50%;
    display: flex;
    flex-direction: column;
    margin-top: 2rem;
`;

const Button = styled(UnstyledButton)`
    margin-top: 1rem;
`;

export default function LoadingScreen() {
    const [, {setGameCode}] = useContext(GameContext);
    const [gameCode, updateGameCode] = useEvent('', ({target: {value}}) => value);

    function submitGameCode() {
        setGameCode(gameCode);
    }

    return (
        <TitleScreen
            title="Please Choose a Game Code"
            subtitle="Players will select this code from the list of available games"
        >
            <Form onSubmit={submitGameCode}>
                <TextField
                    value={gameCode}
                    onChange={updateGameCode}
                    label="Game Code"
                    variant="outlined"
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
            </Form>
        </TitleScreen>
    );
};

