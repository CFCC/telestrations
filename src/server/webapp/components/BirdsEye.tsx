import React, {Component} from 'react';
import {createStyles, Grid, Icon, IconButton, Menu, MenuItem, WithStyles} from "@material-ui/core";
import {State} from "../redux/reducers";
import PlayerStream from "./PlayerStream";
import {UUID} from "../../../types";
import {connectAndStyle} from "../../../util";

const styles = createStyles({});

const mapStateToProps = (state: State) => ({
    players: state.players
});

const mapDispatchToProps = {
    viewNotepadHistory: () => null,
    viewPlayerHistory: () => null,
    watchStreamFullScreen: () => null
};

type BirdsEyeProps = WithStyles<typeof styles> & typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

interface BirdsEyeState {
    menuAnchorElement: HTMLElement | null;
    menuPlayerId: UUID | null;
}

class BirdsEye extends Component<BirdsEyeProps, BirdsEyeState> {
    state = {
        menuAnchorElement: null,
        menuPlayerId: null
    };

    openMenu = (id: UUID, e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        this.setState({menuAnchorElement: e.currentTarget, menuPlayerId: id});
    };

    closeMenu = () => {
        this.setState({menuAnchorElement: null, menuPlayerId: null});
    };

    render() {
        return <div>
            <Grid container>
                {
                    this.props.players.map(player => <Grid item xs={12} sm={6} lg={4} xl={3}
                                                                    onClick={this.props.watchStreamFullScreen}
                                                                    key={player}>
                        <PlayerStream playerId={player} />
                        <IconButton onClick={e => this.openMenu(player, e)}
                                    aria-owns={this.state.menuPlayerId === player ? 'menu' : undefined}
                                    aria-haspopup="true">
                            <Icon>more_vert</Icon>
                        </IconButton>
                    </Grid>)
                }
            </Grid>
            <Menu open={Boolean(this.state.menuAnchorElement)}
                  id="menu"
                  onClose={this.closeMenu}
                  anchorEl={this.state.menuAnchorElement}>
                <MenuItem onClick={this.props.viewPlayerHistory}>View Player History</MenuItem>
                <MenuItem onClick={this.props.viewNotepadHistory}>View Notepad History</MenuItem>
            </Menu>
        </div>;
    }
}

export default connectAndStyle(BirdsEye, mapStateToProps, mapDispatchToProps, styles);