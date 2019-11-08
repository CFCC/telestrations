import React, {ChangeEvent, FormEvent, useContext} from "react";
import {Button, CircularProgress, TextField, withStyles} from "@material-ui/core";
import {ClientGameState} from "../../types/client";
import {ClassProps} from "../../types/shared";
import {GameContext} from "../Store";

export default withStyles({
    app: {
        backgroundColor: "#FFC20E",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        overflow: "auto",
        padding: "1em",
        marginBottom: "1em",
    },
    progress: {
        margin: 5,
    },
    img: {
        maxWidth: "80%",
    },
    input: {
        marginBottom: "1em",
    },
    header: {
        textAlign: "center",
    },
})(function TitleScreen({classes}: ClassProps) {
    const [{state, nickname, nicknameSubmitted}, {submitNickname, setNickname}] = useContext(GameContext);

    const logo = <img src="/logo.png" alt="Telestrations logo" className={classes.img} />;

    const submitNicknameEl = <React.Fragment>
        <h1 className={classes.header}>What is your name?</h1>
        <TextField value={nickname}
            variant="outlined"
            className={classes.input}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)} />
        <Button onClick={submitNickname} variant="contained" color="primary" type="submit">Join Game</Button>
    </React.Fragment>;

    const waitForGameToStart = <React.Fragment>
        <h1 className={classes.header}>Waiting for the game to start</h1>
        <h3>Have your host start the game when everyone's joined!</h3>
        <CircularProgress className={classes.progress} />
    </React.Fragment>;

    const gameAlreadyStarted = <React.Fragment>
        <h1 className={classes.header}>This game's already started!</h1>
        <h3>Wait for it to finish before joining.</h3>
    </React.Fragment>;

    const gameFinished = <React.Fragment>
        <h1 className={classes.header}>The game is finished!</h1>
        <h3>Please ask your host to see the results.</h3>
    </React.Fragment>;

    const getContent = () => {
        switch (state) {
            case ClientGameState.LOADING:
                return nicknameSubmitted ? waitForGameToStart : submitNicknameEl;
            case ClientGameState.FINISHED:
                return gameFinished;
            case ClientGameState.ALREADY_STARTED:
            default:
                return gameAlreadyStarted;
        }
    };

    const dontRefresh = (e: FormEvent) => {
        e.preventDefault();
        return false;
    };

    return (<form onSubmit={dontRefresh}>
        <div className={classes.app}>
            {logo}
            {getContent()}
        </div>
    </form>);
});
