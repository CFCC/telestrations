import React, {Component} from 'react';
import {createStyles, WithStyles} from "@material-ui/core";
import {UUID} from "../../../types";
import {State} from "../redux/reducers";
import {connectAndStyle} from "../../../util";

const styles = createStyles({
    app: {

    }
});

interface OwnProps {
    playerId: UUID;
}

const mapStateToProps = (state: State) => ({
    notepads: state.notepads,
    players: state.players
});

type PlayerStreamProps = OwnProps & WithStyles<typeof styles> & ReturnType<typeof mapStateToProps>;

class PlayerStream extends Component<PlayerStreamProps> {
    render() {
        const playerIndex = this.props.players.findIndex(p => p.id === this.props.playerId);
        const notepadIndex = this.props.notepads.findIndex(n => n.owner === this.props.players[playerIndex].ownerOfCurrentNotepad);

        const prevContent = this.props.notepads[notepadIndex].content[this.props.players[playerIndex].notepadIndex - 1];
        const content = this.props.notepads[notepadIndex].content[this.props.players[playerIndex].notepadIndex];

        return this.props.players[playerIndex].notepadIndex % 2 === 0 ? <div>
            <img src={prevContent} alt={content} />
            <h5>{content}</h5>
        </div> : <div>
            <img src={content} alt={prevContent} />
            <h5>{prevContent}</h5>
        </div>;
    }
}

export default connectAndStyle<OwnProps>(PlayerStream, mapStateToProps, {}, styles);