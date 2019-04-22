import React, {ChangeEvent, Component} from 'react';
import {Button, CircularProgress, createStyles, TextField, Theme, WithStyles} from "@material-ui/core";
import {connectAndStyle} from "../util";
import {State} from "../redux/reducers";
import * as Creators from "../redux/actions";
import {ClientGameState} from "../../types";

const styles = (theme: Theme) => createStyles({
    app: {
        backgroundColor: '#FFC20E',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'auto',
        padding: '1em',
        marginBottom: '1em'
    },
    progress: {
        margin: theme.spacing.unit * 5
    },
    img: {
        maxWidth: '80%'
    },
    input: {
        marginBottom: '1em'
    },
    header: {
        textAlign: 'center'
    }
});

const mapStateToProps = (state: State) => ({
    nickname: state.nickname,
    state: state.state,
    nicknameSubmitted: state.nicknameSubmitted
});

const mapDispatchToProps = {
    submitNickname: Creators.submitNickname,
    setNickname: (nickname: String) => Creators.setNickname(nickname)
};

type LoadingScreenProps = WithStyles<typeof styles> & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

class TitleScreen extends Component<LoadingScreenProps> {
    logo = <img src="/logo.png" alt="Telestrations logo" className={this.props.classes.img} />;

    submitNickname = () => [
        <h1 className={this.props.classes.header}>What is your name?</h1>,
        <TextField value={this.props.nickname}
                   variant="outlined"
                   className={this.props.classes.input}
                   onChange={(e: ChangeEvent<HTMLInputElement>) => this.props.setNickname(e.target.value)} />,
        <Button onClick={this.props.submitNickname} variant="contained" color="primary">Join Game</Button>
    ];

    waitForGameToStart = () => [
        <h1 className={this.props.classes.header}>Waiting for the game to start</h1>,
        <h3>Have your host start the game when everyone's joined!</h3>,
        <CircularProgress className={this.props.classes.progress} />
    ];

    gameAlreadyStarted = () => [
        <h1 className={this.props.classes.header}>This game's already started!</h1>,
        <h3>Wait for it to finish before joining.</h3>
    ];

    gameFinished = () => [
        <h1 className={this.props.classes.header}>The game is finished!</h1>,
        <h3>Please ask your host to see the results.</h3>
    ];

    getContent = () => {
        switch(this.props.state) {
            case ClientGameState.LOADING:
                return this.props.nicknameSubmitted ? this.waitForGameToStart() : this.submitNickname();
            case ClientGameState.FINISHED:
                return this.gameFinished();
            case ClientGameState.ALREADY_STARTED:
            default:
                return this.gameAlreadyStarted();
        }
    };

    render() {
        return <div className={this.props.classes.app}>
            {this.logo}
            {this.getContent()}
        </div>;
    }
}

export default connectAndStyle(TitleScreen, mapStateToProps, mapDispatchToProps, styles);