import React, {useContext, useEffect, useRef, useState} from "react";
import {Button, FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import * as firebase from "firebase/app";
import styled from "styled-components";

import TitleScreen from "components/TitleScreen";
import {useEvent} from "utils/hooks";
import {GameContext} from "client/Store";
import {ClientGameState} from "types/client";

const SelectWrapper = styled(FormControl)`
     margin: 2rem 0 1rem;
     width: 50%;
`;

export default function GameSelection() {
    const [games, setGames] = useState<string[]>([]);
    const [labelWidth, setLabelWidth] = useState(0);
    const inputLabel = useRef<HTMLLabelElement>(null);
    const [game, setGame, rawSetGame] = useEvent("", ({target: {value}}) => value);
    const [, {setGameState}] = useContext(GameContext);
    const lobbies = firebase.firestore().collection("lobby");

    useEffect(
        () => lobbies.onSnapshot(function(snapshot) {
            let currentGameStillAvailable = false;
            const newGames: string[] = [];
            snapshot.forEach(doc => {
                if (game === doc.id) currentGameStillAvailable = true;
                newGames.push(doc.id);
            });

            setGames(newGames);
            if (!currentGameStillAvailable) rawSetGame("");
        }),
        []
    );

    useEffect(() => {
        setLabelWidth(inputLabel.current?.offsetWidth || 0);
    }, []);

    function joinGame() {
        setGameState(ClientGameState.WAITING_TO_START);
    }

    return (
        <TitleScreen title="Please select a game to join">
            <SelectWrapper variant="outlined">
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
                        <MenuItem value={gameOption} key={gameOption}>{gameOption}</MenuItem>
                    ))}
                </Select>
            </SelectWrapper>
            <Button
                onClick={joinGame}
                variant="contained"
                color="primary"
                disabled={game === ""}
                size="large"
            >
                Join Game
            </Button>
        </TitleScreen>
    );
}
