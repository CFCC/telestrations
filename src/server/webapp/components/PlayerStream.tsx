import React, {Component} from 'react';
import {createStyles, WithStyles} from "@material-ui/core";
import {UUID} from "../../../types";
import {State} from "../redux/reducers";

const styles = createStyles({
    app: {

    }
});

const mapStateToProps = (state: State) => ({

});

interface Props {
    playerId: UUID;
}

type PlayerStreamProps = Props & Partial<WithStyles<typeof styles>>;

class PlayerStream extends Component<PlayerStreamProps> {
    render() {
        return <div>

        </div>;
    }
}

export default PlayerStream;