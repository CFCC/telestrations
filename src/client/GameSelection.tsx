import React, {useContext, useEffect, useRef, useState} from "react";
import {Button as UnstyledButton, FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import * as firebase from "firebase/app";
import styled from "styled-components";
import Cookies from "js-cookie";

import TitleScreen from "../components/TitleScreen";
import {useEvent} from "../utils/hooks";
import {GameContext} from "../store/client";

const Form = styled.form`
    width: 50%;
    display: flex;
    flex-direction: column;
`;

const Button = styled(UnstyledButton)`
    margin-top: 1rem;
`;

export default function GameSelection() {
    const [games, setGames] = useState<string[]>([]);
    const [labelWidth, setLabelWidth] = useState(0);
    const inputLabel = useRef<HTMLLabelElement>(null);
    const [game, setGame, rawSetGame] = useEvent("", ({target: {value}}) => value);
    const [, {joinGame}] = useContext(GameContext);

    useEffect(
        () => firebase
            .firestore()
            .collection("games")
            .where("status", "==", "lobby")
            .onSnapshot(async function(snapshot) {
                const newGames = snapshot.docs.map(doc => doc.id);
                setGames(newGames);
                if (!newGames.includes(game)) rawSetGame("");
            }),
        [game, rawSetGame]
    );

    useEffect(() => {
        setLabelWidth(inputLabel.current?.offsetWidth || 0);
    }, []);

    function onSubmit() {
        Cookies.set("gameCode", game, {expires: 0.66})
        joinGame(game);
    }

    useEffect(() => {
        const gameCode = Cookies.get("gameCode");
        if (gameCode) {
            joinGame(gameCode);
        }
    });

    return (
        <TitleScreen title="Please select a game to join">
            <Form onSubmit={onSubmit}>
                <FormControl variant="outlined">
                    <InputLabel ref={inputLabel} id="game-label">
                        Game Code
                    </InputLabel>
                    <Select
                        labelId="game-label"
                        value={game}
                        onChange={setGame}
                        labelWidth={labelWidth}
                    >
                        <MenuItem value="">None</MenuItem>
                        {games.map(gameOption => (
                            <MenuItem value={gameOption} key={gameOption}>
                                {gameOption}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    onClick={onSubmit}
                    variant="contained"
                    color="primary"
                    disabled={game === ""}
                    size="large"
                >
                    Join Game
                </Button>
            </Form>
        </TitleScreen>
    );
}
