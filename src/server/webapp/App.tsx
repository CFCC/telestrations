import React, {Component} from 'react';
import io from './socket-io';
import {Button, CircularProgress, createStyles, Theme, withStyles, WithStyles} from "@material-ui/core";

const styles = (theme: Theme) => createStyles({
    app: {
        backgroundColor: '#FFC20E',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        height: '100vh'
    },
    progress: {
        margin: theme.spacing.unit * 5
    },
    img: {
        maxWidth: '50%'
    }
});

interface LoadingScreenProps extends WithStyles<typeof styles> {

}

interface LoadingScreenState {
    players: Array<String>
}

class LoadingScreen extends Component<LoadingScreenProps, LoadingScreenState> {
    constructor(props: LoadingScreenProps) {
        super(props);

        io.emit('i am a server');
        io.on('player added', (players: Array<String>) => this.setState({players}));
    }

    state = {
        players: []
    };

    render() {
        return (
            <div className={this.props.classes.app}>
                <img src="/logo.png" alt="Telestrations logo" className={this.props.classes.img} />
                <h1>Waiting for clients to connect</h1>
                <h3>Start the game when everyone's joined!</h3>
                <CircularProgress className={this.props.classes.progress} />
                <ul>
                    {this.state.players.map(player => <li>{player}</li>)}
                </ul>
                <Button>Start Game</Button>
            </div>
        );
    }
}

export default withStyles(styles)(LoadingScreen);