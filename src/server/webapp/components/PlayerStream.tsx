import React, {useContext} from "react";
import {withStyles} from "@material-ui/core";
import {ClassProps, UUID} from "../../../types/shared";
import {GameContext} from "../Store";

interface PlayerStreamProps extends ClassProps {
    playerId: UUID;
}

export default withStyles({
    app: {},
})(function PlayerStream({classes, playerId}: PlayerStreamProps) {
    const [{players, notepads}] = useContext(GameContext);
    const playerIndex = players.findIndex(p => p.id === playerId);
    const notepadIndex = notepads.findIndex(n => n.owner === players[playerIndex].ownerOfCurrentNotepad);

    const prevContent = players[playerIndex].notepadIndex === 0
        ? "/question-marks.jpg"
        : notepads[notepadIndex].content[players[playerIndex].notepadIndex - 1];
    const content = notepads[notepadIndex].content[players[playerIndex].notepadIndex];

    return players[playerIndex].notepadIndex % 2 === 0 ? <div className={classes.app}>
        <img src={prevContent} alt={content} />
        <h5>{content}</h5>
    </div> : <div className={classes.app}>
        <img src={content} alt={prevContent} />
        <h5>{prevContent}</h5>
    </div>;
});
