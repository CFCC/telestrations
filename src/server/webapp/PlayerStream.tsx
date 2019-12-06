import React, {useContext} from "react";
import {CardContent, Typography} from "@material-ui/core";
import styled from "styled-components";
import {UUID} from "types/shared";
import {GameContext} from "server/webapp/Store";

interface PlayerStreamProps {
    playerId: UUID;
}

const Picture = styled.img`
    max-width: 100%;
    min-width: 100%;
    height: auto;
    box-shadow: inset 0 2px 4px 0 hsla(0, 0%, 0%, 0.2);
`;

export default function PlayerStream({playerId}: PlayerStreamProps) {
    const [{players, notepads}] = useContext(GameContext);
    const playerIndex = players.findIndex(p => p.id === playerId);
    const notepadIndex = notepads.findIndex(n => n.owner === players[playerIndex].ownerOfCurrentNotepad);

    const playerIndexInNotepad = players[playerIndex].notepadIndex;
    const playerDrawing = playerIndexInNotepad % 2 === 0;
    const playerWaiting = playerIndexInNotepad === -1;

    const prevContent = playerIndexInNotepad === 0 || playerWaiting
        ? "/question-marks.jpg"
        : notepads[notepadIndex].content[playerIndexInNotepad - 1];
    const content = playerWaiting
        ? "Waiting for next notepad..."
        : notepads[notepadIndex].content[playerIndexInNotepad];

    let picture;
    if (playerWaiting || playerIndexInNotepad === 0) picture = "/question-marks.jpg";
    else if (playerDrawing) picture = `http://localhost:${process.env.REACT_APP_SERVER_PORT}${prevContent}`;
    else picture = `http://localhost:${process.env.REACT_APP_SERVER_PORT}${content}`;

    return (<React.Fragment>
        <Picture
            src={picture}
            alt={playerDrawing || playerWaiting ? content : prevContent}
        />
        <CardContent>
            <Typography align="center">
                {playerDrawing || playerWaiting ? content : prevContent}
            </Typography>
        </CardContent>
    </React.Fragment>);
}
