import React, {useContext, useEffect} from "react";
import {
    Button, Typography,
    withStyles,
} from "@material-ui/core";
import {ClassProps} from "types/shared";
import {GameContext} from "server/webapp/Store";
import {darkPrimary, primary} from "utils/theme";

export default withStyles({
    app: {
        background: `linear-gradient(180deg, ${primary} 50%, ${darkPrimary} 100%)`,
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
    },
    img: {
        maxWidth: "50%",
        margin: "1rem",
    },
    header: {
        textAlign: "center",
        fontSize: "2rem",
        margin: "1rem",
        fontWeight: "bold",
    },
    subHeader: {
        fontStyle: "italic",
    },
    playerList: {
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap",
        margin: "2rem 1rem",
        width: "calc(100% - 1rem)",
    },
    playerLabel: {
        flexBasis: "33%",
        flex: 1,
        textAlign: "center",
        marginBottom: "0.75rem",
    },
})(function LoadingScreen({classes}: ClassProps) {
    const [{players}, {init, startGame}] = useContext(GameContext);

    useEffect(() => {
        init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (<div className={classes.app}>
        <img src="/logo.png" alt="Telestrations logo" className={classes.img} />
        <Typography className={classes.header}>Waiting for clients to connect</Typography>
        <Typography className={classes.subHeader}>Start the game when everyone's joined!</Typography>
        <div className={classes.playerList}>
            {players.map((player, i) => (<Typography key={i} className={classes.playerLabel}>
                {player.nickname}
            </Typography>))}
        </div>
        <Button
            onClick={startGame}
            variant="contained"
            color="primary"
            disabled={players.length < 2}
            size="large"
        >
            Start Game
        </Button>
    </div>);
});

