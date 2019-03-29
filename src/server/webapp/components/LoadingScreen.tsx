import React, {Component} from 'react';
import io from '../socket-io';
import {AccountCircle as PersonIcon} from '@material-ui/icons'
import {
    Button,
    createStyles,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    WithStyles,
    withStyles
} from "@material-ui/core";
import {
    blue, cyan, green, indigo, lime, orange, purple, red, teal, yellow
} from '@material-ui/core/colors';

const colors = [blue, cyan, green, indigo, lime, orange, purple, red, teal, yellow];

const styles = createStyles({
    app: {
        backgroundColor: '#FFC20E',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        height: '100vh'
    },
    img: {
        maxWidth: '50%'
    },
    header: {
        textAlign: 'center'
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

    startGame = () => io.emit('start game');

    render() {
        return (
            <div className={this.props.classes.app}>
                <img src="/logo.png" alt="Telestrations logo" className={this.props.classes.img} />
                <h1 className={this.props.classes.header}>Waiting for clients to connect</h1>
                <h3>Start the game when everyone's joined!</h3>
                <List>
                    {this.state.players.map((player, i) => <ListItem key={i}>
                            <ListItemIcon>
                                <PersonIcon style={{
                                    color: colors[Math.floor(Math.random() * colors.length)][500]
                                }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={player}
                            />
                        </ListItem>
                    )}
                </List>
                <Button onClick={this.startGame}
                        variant="contained"
                        color="primary"
                        disabled={this.state.players.length === 0}>Start Game</Button>
            </div>
        );
    }
}

export default withStyles(styles)(LoadingScreen);