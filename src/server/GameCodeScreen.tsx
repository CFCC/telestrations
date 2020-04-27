import React, {FormEvent, useEffect} from "react";
import {Button as UnstyledButton, TextField} from "@material-ui/core";
import styled from "styled-components";
import Cookies from "js-cookie";
import {useDispatch} from "react-redux";

import {setGameCode} from "../utils/store";
import TitleScreen from "../components/TitleScreen";
import {useEvent} from "../utils/hooks";

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
    const dispatch = useDispatch();
    const [gameCode, updateGameCode] = useEvent('', ({target: {value}}) => value);

    function submitGameCode(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        Cookies.set("gameCode", gameCode, {expires: 0.66});
        dispatch(setGameCode(gameCode));
    }

    useEffect(() => {
        const oldGameCode = Cookies.get("gameCode");
        console.log(oldGameCode);
        if (oldGameCode) {
            dispatch(setGameCode(oldGameCode));
        }
    }, [dispatch]);

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
                    type="submit"
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

