import React, {ChangeEvent, Component} from 'react';
import {Button, CircularProgress, createStyles, TextField, Theme, WithStyles} from "@material-ui/core";
import {State} from "../reducers";
import {Dispatch} from "redux";
import {connectAndStyle} from "../util";
import * as ConfigCreators from '../creators/config';

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

interface StateProps {
    nickname: string;
    gameAlreadyStarted: boolean;
    nicknameSubmitted: boolean;
}

interface DispatchProps {
    submitNickname: () => ConfigCreators.submitNickname,
    setNickname: (nickname: String) => ConfigCreators.setNickname
}

class LoadingScreen extends Component<WithStyles<typeof styles> & StateProps & DispatchProps> {
    logo = <img src="/logo.png" alt="Telestrations logo" className={this.props.classes.img} />;

    submitNickname = () => <div className={this.props.classes.app}>
        {this.logo}
        <h1 className={this.props.classes.header}>What is your name?</h1>
        <TextField value={this.props.nickname}
                   variant="outlined"
                   className={this.props.classes.input}
                   onChange={(e: ChangeEvent<HTMLInputElement>) => this.props.setNickname(e.target.value)} />
        <Button onClick={this.props.submitNickname} variant="contained" color="primary">Join Game</Button>
    </div>;

    waitForGameToStart = () => <div className={this.props.classes.app}>
        {this.logo}
        <h1 className={this.props.classes.header}>Waiting for the game to start</h1>
        <h3>Have your host start the game when everyone's joined!</h3>
        <CircularProgress className={this.props.classes.progress} />
    </div>;

    gameAlreadyStarted = () => <div className={this.props.classes.app}>
        {this.logo}
        <h1 className={this.props.classes.header}>This game's already started!</h1>
        <h3>Wait for it to finish before joining.</h3>
    </div>;

    render() {
        if (this.props.gameAlreadyStarted) return this.gameAlreadyStarted();
        else if (this.props.nicknameSubmitted) return this.waitForGameToStart();
        else return this.submitNickname();
    }
}

const mapStateToProps = (state: State): StateProps => ({
    nickname: state.config.nickname,
    gameAlreadyStarted: state.config.state === 'already started',
    nicknameSubmitted: state.config.nicknameSubmitted
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    submitNickname: () => dispatch(ConfigCreators.submitNickname()),
    setNickname: (nickname: String) => dispatch(ConfigCreators.setNickname(nickname))
});

export default connectAndStyle(LoadingScreen, mapStateToProps, mapDispatchToProps, styles);