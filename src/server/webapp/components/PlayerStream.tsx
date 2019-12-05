import React, {useContext} from "react";
import {Typography, withStyles} from "@material-ui/core";
import {ClassProps, UUID} from "types/shared";
import {GameContext} from "server/webapp/Store";

interface PlayerStreamProps extends ClassProps {
    playerId: UUID;
}

export default withStyles({
    app: {},
    text: {
        textAlign: "center",
    },
    image: {
        width: "100%",
        height: "auto",
    },
})(function PlayerStream({classes, playerId}: PlayerStreamProps) {
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

    return (<div className={classes.app}>
        <img
            className={classes.image}
            src={picture}
            alt={playerDrawing || playerWaiting ? content : prevContent}
        />
        <Typography className={classes.text}>
            {playerDrawing || playerWaiting ? content : prevContent}
        </Typography>
    </div>);
});
