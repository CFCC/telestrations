import React, {useContext} from "react";
import {CardContent, Typography} from "@material-ui/core";
import styled from "styled-components";

import {UUID} from "../types/shared";
import {GameContext} from "../store/server";

interface PlayerStreamProps {
    playerId: UUID;
}

interface PictureContainerProps {
    picture: string;
}

const PictureContainer = styled.div`
    background-image: ${(props: PictureContainerProps) => props.picture === "/question-marks.jpg" ? "url(/question-marks.jpg)" : "none"};
    background-repeat: repeat;
    width: 100%;
    min-height: ${(props: PictureContainerProps) => props.picture === "/question-marks.jpg" ? "300px" : "0"};
`;

const Picture = styled.img`
    max-width: 100%;
    min-width: 100%;
    height: auto;
`;

const Content = styled(CardContent)`
    padding-bottom: 0;
`;

export default function PlayerStream({playerId}: PlayerStreamProps) {
    const [{game: {players, notepads}}] = useContext(GameContext);

    const playerIndexInNotepad = notepads[players[playerId].currentNotepad].pages.length;
    const playerDrawing = playerIndexInNotepad % 2 === 0;
    const playerWaiting = playerIndexInNotepad === -1;

    const prevContent = playerIndexInNotepad === 0 || playerWaiting
        ? "/question-marks.jpg"
        : notepads[players[playerId].currentNotepad].pages[playerIndexInNotepad - 1].content;
    const content = playerWaiting
        ? "Waiting for next notepad..."
        : notepads[players[playerId].currentNotepad].pages[playerIndexInNotepad]?.content;

    let picture;
    if (playerWaiting || playerIndexInNotepad === 0) picture = "/question-marks.jpg";
    else if (playerDrawing) picture = prevContent;
    else picture = content;

    return (
        <React.Fragment>
            <PictureContainer picture={picture}>
                {picture !== "/question-marks.jpg" && <Picture
                    src={picture}
                    alt={playerDrawing || playerWaiting ? content : prevContent}
                />}
            </PictureContainer>
            <Content>
                <Typography align="center">
                    {playerDrawing || playerWaiting ? content : prevContent}
                </Typography>
            </Content>
        </React.Fragment>
    );
}
