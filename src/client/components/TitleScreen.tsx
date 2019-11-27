import React, {ChangeEvent, FormEvent, useContext, useEffect} from "react";
import {Button, CircularProgress, TextField, Typography, withStyles} from "@material-ui/core";
import {ClientGameState} from "types/client";
import {ClassProps} from "types/shared";
import {GameContext} from "client/Store";
import {darkPrimary, primary} from "utils/theme";

export default withStyles({
    app: {
        background: `linear-gradient(180deg, ${primary} 50%, ${darkPrimary} 100%)`,
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        overflow: "auto",
    },
    progress: {
        margin: "1rem",
        width: "3rem",
        height: "3rem",
    },
    img: {
        maxWidth: "50%",
        margin: "1rem",
    },
    input: {
        marginBottom: "1rem",
    },
    header: {
        textAlign: "center",
        fontSize: "2rem",
        margin: "1rem",
        fontWeight: "bold",
    },
})(function TitleScreen({classes}: ClassProps) {
    const [{state, nickname, nicknameSubmitted}, {submitNickname, setNickname, init}] = useContext(GameContext);

    useEffect(() => {
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const logo = <img src="/logo.png" alt="Telestrations logo" className={classes.img} />;

    const submitNicknameEl = <React.Fragment>
        <Typography className={classes.header}>What is your name?</Typography>
        <TextField value={nickname}
            variant="outlined"
            className={classes.input}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)} />
        <Button variant="contained" color="primary" type="submit" size="large">Join Game</Button>
    </React.Fragment>;

    const waitForGameToStart = <React.Fragment>
        <Typography className={classes.header}>Waiting for the game to start</Typography>
        <Typography>Have your host start the game when everyone's joined!</Typography>
        <CircularProgress className={classes.progress} />
    </React.Fragment>;

    const gameAlreadyStarted = <React.Fragment>
        <Typography className={classes.header}>This game's already started!</Typography>
        <Typography>Wait for it to finish before joining.</Typography>
    </React.Fragment>;

    const gameFinished = <React.Fragment>
        <Typography className={classes.header}>The game is finished!</Typography>
        <Typography>Please ask your host to see the results.</Typography>
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

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        submitNickname();
        return false;
    };

    return (<form onSubmit={onSubmit}>
        <div className={classes.app}>
            {logo}
            {getContent()}
        </div>
    </form>);
});
