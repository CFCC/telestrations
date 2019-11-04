import React, {ChangeEvent, Component, FormEvent} from 'react';
import {Button, CircularProgress, createStyles, TextField, Theme, withStyles, WithStyles} from "@material-ui/core";
import {State} from "client/redux/reducers";
import * as Creators from "client/redux/actions";
import {connect} from "react-redux";
import {ClientGameState} from "types/client";

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

export default
@withStyles(styles)
@connect(mapStateToProps, mapDispatchToProps)
class TitleScreen extends Component<LoadingScreenProps> {
    logo = <img src="/logo.png" alt="Telestrations logo" className={this.props.classes.img} />;

    submitNickname = () => [
        <h1 className={this.props.classes.header}>What is your name?</h1>,
        <TextField value={this.props.nickname}
                   variant="outlined"
                   className={this.props.classes.input}
                   onChange={(e: ChangeEvent<HTMLInputElement>) => this.props.setNickname(e.target.value)} />,
        <Button onClick={this.props.submitNickname} variant="contained" color="primary" type="submit">Join Game</Button>
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
        switch (this.props.state) {
            case ClientGameState.LOADING:
                return this.props.nicknameSubmitted ? this.waitForGameToStart() : this.submitNickname();
            case ClientGameState.FINISHED:
                return this.gameFinished();
            case ClientGameState.ALREADY_STARTED:
            default:
                return this.gameAlreadyStarted();
        }
    };

    dontRefresh = (e: FormEvent) => {
        e.preventDefault();
        return false;
    };

    render() {
        return <form onSubmit={this.dontRefresh}>
            <div className={this.props.classes.app}>
                {this.logo}
                {this.getContent().map((x, i) => ({...x, key: i}))}
            </div>
        </form>;
    }
}
