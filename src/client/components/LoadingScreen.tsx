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
        padding: '1em'
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
    nicknameSubmitted: boolean;
}

interface DispatchProps {
    submitNickname: () => ConfigCreators.submitNickname,
    setNickname: (nickname: String) => ConfigCreators.setNickname
}

class LoadingScreen extends Component<WithStyles<typeof styles> & StateProps & DispatchProps> {
    render() {
        return (
            <div className={this.props.classes.app}>
                <img src="/logo.png" alt="Telestrations logo" className={this.props.classes.img} />
                {this.props.nicknameSubmitted
                    ? [
                        <h1 className={this.props.classes.header}>Waiting for the game to start</h1>,
                        <h3>Have your host start the game when everyone's joined!</h3>,
                        <CircularProgress className={this.props.classes.progress} />
                    ]
                    : [
                        <h1 className={this.props.classes.header}>What is your name?</h1>,
                        <TextField value={this.props.nickname}
                                   variant="outlined"
                                   className={this.props.classes.input}
                                   onChange={(e: ChangeEvent<HTMLInputElement>) => this.props.setNickname(e.target.value)} />,
                        <Button onClick={this.props.submitNickname} variant="raised" color="primary">Join Game</Button>
                    ]
                }
            </div>
        );
    }
}

const mapStateToProps = (state: State): StateProps => ({
    nickname: state.config.nickname,
    nicknameSubmitted: state.config.nicknameSubmitted
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    submitNickname: () => dispatch(ConfigCreators.submitNickname()),
    setNickname: (nickname: String) => dispatch(ConfigCreators.setNickname(nickname))
});

export default connectAndStyle(LoadingScreen, mapStateToProps, mapDispatchToProps, styles);