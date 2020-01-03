import React, {useContext, useEffect, useRef, useState} from "react";
import {Button, FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import * as firebase from "firebase/app";

import TitleScreen from "components/TitleScreen";
import {useEvent} from "utils/hooks";
import {GameContext} from "./Store";
import {ClientGameState} from "../types/client";

export default function GameSelection() {
    const [games, setGames] = useState<string[]>([]);
    const [labelWidth, setLabelWidth] = useState(0);
    const inputLabel = useRef<HTMLLabelElement>(null);
    const [game, setGame, rawSetGame] = useEvent("", ({target: {value}}) => value);
    const [, {setGameState}] = useContext(GameContext);
    const lobbies = firebase.firestore().collection("lobby");

    useEffect(
        () => lobbies.onSnapshot(function(snapshot) {
                console.log(games);
                const newGames = [...games];
                snapshot.docChanges().forEach(function(change) {
                    console.log(change);
                    if (change.type === "added") {
                        if (newGames.indexOf(change.doc.id) === -1) newGames.push(change.doc.id);
                    }
                    if (change.type === "modified") {
                        newGames.splice(change.oldIndex, 1, change.doc.id);
                    }
                    if (change.type === "removed") {
                        newGames.splice(change.oldIndex, 1);
                    }
                });

                setGames(newGames);
                if (!newGames.includes(game)) rawSetGame("");
            }),
        [games]
    );

    useEffect(() => {
        setLabelWidth(inputLabel.current?.offsetWidth || 0);
    }, []);

    function joinGame() {
        setGameState(ClientGameState.WAITING_TO_START);
    }

    return (
        <TitleScreen title="Please select a game to join">
            <form>
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
                            <MenuItem value={gameOption} key={gameOption}>{gameOption}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    onClick={joinGame}
                    variant="contained"
                    color="primary"
                    disabled={game === ""}
                    size="large"
                >
                    Join Game
                </Button>
            </form>
        </TitleScreen>
    );
}
