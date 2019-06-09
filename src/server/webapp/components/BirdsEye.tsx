import React, {Component} from 'react';
import {createStyles, Grid, Icon, IconButton, Menu, MenuItem, Paper, Typography, WithStyles} from "@material-ui/core";
// @ts-ignore - (TODO) I'm not really sure what's happening here. Maybe there's a different package that plays nicer with TS
import screenfull from 'screenfull';
import {State} from "../redux/reducers";
import PlayerStream from "./PlayerStream";
import * as Actions from '../redux/actions';
import {UUID, ObjectOfRefs} from "../../../types";
import {connectAndStyle} from "../../../util";

const styles = createStyles({
    app: {
        padding: '8px'
    }
});

const mapStateToProps = (state: State) => ({
    players: state.players
});

const mapDispatchToProps = {
    viewNotepadHistory: Actions.viewNotepadHistory,
    viewPlayerHistory: Actions.viewPlayerHistory
};

type BirdsEyeProps = WithStyles<typeof styles> & typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

interface BirdsEyeState {
    menuAnchorElement: HTMLElement | null;
    menuPlayerId: UUID;
}

class BirdsEye extends Component<BirdsEyeProps, BirdsEyeState> {
    state = {
        menuAnchorElement: null,
        menuPlayerId: ''
    };

    streamRefs: ObjectOfRefs = {};

    openMenu = (id: UUID, e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        this.setState({menuAnchorElement: e.currentTarget, menuPlayerId: id});
    };

    closeMenu = () => {
        this.setState({menuAnchorElement: null});
    };

    makeFullScreen = (id: UUID) => {
        if (screenfull.enabled) screenfull.request(this.streamRefs[id]);
    };

    componentDidMount() {
        this.props.players.forEach(p => {
            this.streamRefs[p.id] = React.createRef();
        });
    }

    render() {
        return <div className={this.props.classes.app}>
            <Grid container spacing={8}>
                {
                    this.props.players.map(player => <Grid item xs={12} sm={6} lg={4} xl={3} key={player.id}>
                        <Paper>
                            <Typography variant="h4" gutterBottom>{player.nickname}</Typography>
                            <PlayerStream playerId={player.id} /* ref={this.streamRefs[player.id]} */ />
                            <IconButton onClick={e => this.openMenu(player.id, e)}
                                        aria-owns={this.state.menuPlayerId === player.id ? 'menu' : undefined}
                                        aria-haspopup="true">
                                <Icon>more_vert</Icon>
                            </IconButton>
                        </Paper>
                    </Grid>)
                }
            </Grid>
            <Menu open={Boolean(this.state.menuAnchorElement)}
                  id="menu"
                  onClose={this.closeMenu}
                  anchorEl={this.state.menuAnchorElement}>
                <MenuItem onClick={() => this.props.viewPlayerHistory(this.state.menuPlayerId)}>
                    View Player History
                </MenuItem>
                <MenuItem onClick={() => this.props.viewNotepadHistory(this.state.menuPlayerId)}>
                    View Notepad History
                </MenuItem>
                {/*<MenuItem onClick={() => this.makeFullScreen(this.state.menuPlayerId)}>*/}
                {/*    Make Stream Fullscreen*/}
                {/*</MenuItem>*/}
            </Menu>
        </div>;
    }
}

export default connectAndStyle(BirdsEye, mapStateToProps, mapDispatchToProps, styles);