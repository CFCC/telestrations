import React, {ChangeEvent, Component} from 'react';
import {Button, CircularProgress, createStyles, TextField, Theme, WithStyles} from "@material-ui/core";
import {State} from "../reducers";
import {Dispatch} from "redux";
import {connectAndStyle} from "../../../util";
import * as ConfigCreators from '../creators/config';

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
        maxWidth: '80%'
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
                    ? <div>
                        <h1>Waiting for the game to start</h1>
                        <h3>Have your host start the game when everyone's joined!</h3>
                        <CircularProgress className={this.props.classes.progress} />
                    </div>
                    : <div>
                        <h1>What is your name?</h1>
                        <TextField value={this.props.nickname}
                                   onChange={(e: ChangeEvent<HTMLInputElement>) => this.props.setNickname(e.target.value)} />
                        <Button onClick={this.props.submitNickname}>Join Game</Button>
                    </div>
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