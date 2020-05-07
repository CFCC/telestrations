import React, {useEffect, useState} from "react";
import {CardContent, Typography} from "@material-ui/core";
import styled from "styled-components";

import {useSelector} from "../utils/store";
import {getImageURL} from "../utils/firebase";

interface PlayerStreamProps {
    playerId: string;
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
    const {players, notepads} = useSelector(state => state.firebase);
    const [pictureUrl, setPictureUrl] = useState("");

    const notepad = notepads[players[playerId]?.currentNotepad];
    const playerIndexInNotepad = notepad?.pages?.length;

    let picture: string, t, text;
    if (playerIndexInNotepad == null) {
        picture = "/question-marks.jpg";
        text = "Waiting for next notepad...";
    } else if (playerIndexInNotepad <= 1) {
        picture = "/question-marks.jpg";
        text = notepad.pages[playerIndexInNotepad - 1]?.content;
    } else if (playerIndexInNotepad % 2 === 0) {
        picture = notepad.pages[playerIndexInNotepad - 1]?.content;
        t = notepad.pages[playerIndexInNotepad - 1]?.lastUpdated;
        text = notepad.pages[playerIndexInNotepad - 2]?.content;
    } else {
        picture = notepad.pages[playerIndexInNotepad - 2]?.content;
        t = notepad.pages[playerIndexInNotepad - 2]?.lastUpdated;
        text = notepad.pages[playerIndexInNotepad - 1]?.content;
    }

    useEffect(() => {
        (async function() {
            const url = await getImageURL(picture);
            setPictureUrl(url);
        })();
    }, [picture, t]);

    return (
        <React.Fragment>
            <PictureContainer picture={picture}>
                {picture !== "/question-marks.jpg" && (
                    <Picture
                        src={pictureUrl}
                        alt={text}
                    />
                )}
            </PictureContainer>
            <Content>
                <Typography align="center">{text}</Typography>
            </Content>
        </React.Fragment>
    );
}
