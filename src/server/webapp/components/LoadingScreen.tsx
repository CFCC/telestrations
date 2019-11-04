import React, {Component} from "react";
import {AccountCircle as PersonIcon} from "@material-ui/icons"
import {
    Button,
    createStyles,
    List,
    ListItem,
    ListItemIcon,
    ListItemText, withStyles,
    WithStyles
} from "@material-ui/core";
import {
    blue, cyan, green, indigo, lime, purple, teal
} from "@material-ui/core/colors";
import * as Actions from "../redux/actions";
import {State} from "../redux/reducers";
import {connect} from "react-redux";

const colors = [blue, cyan, green, indigo, lime, purple, teal];

const styles = createStyles({
    app: {
        backgroundColor: "#FFC20E",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh"
    },
    img: {
        maxWidth: "50%"
    },
    header: {
        textAlign: "center"
    }
});

const mapStateToProps = (state: State) => ({
    players: state.players
});

const mapDispatchToProps = {
    startGame: Actions.startGame,
    init: Actions.init
};

type LoadingScreenProps = WithStyles<typeof styles> & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

@withStyles(styles)
@connect(mapStateToProps, mapDispatchToProps)
export default class LoadingScreen extends Component<LoadingScreenProps> {
    constructor(props: LoadingScreenProps) {
        super(props);
        this.props.init();
    }

    render() {
        return (
            <div className={this.props.classes.app}>
                <img src="/logo.png" alt="Telestrations logo" className={this.props.classes.img} />
                <h1 className={this.props.classes.header}>Waiting for clients to connect</h1>
                <h3>Start the game when everyone's joined!</h3>
                <List>
                    {this.props.players.map((player, i) => <ListItem key={i}>
                            <ListItemIcon>
                                <PersonIcon style={{
                                    color: colors[i % colors.length][500]
                                }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={player.nickname}
                            />
                        </ListItem>
                    )}
                </List>
                <Button onClick={this.props.startGame}
                        variant="contained"
                        color="primary"
                        disabled={this.props.players.length < 2}>Start Game</Button>
            </div>
        );
    }
}
