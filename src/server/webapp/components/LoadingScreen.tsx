import React, {useContext} from "react";
import {AccountCircle as PersonIcon} from "@material-ui/icons"
import {
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    withStyles,
} from "@material-ui/core";
import {
    blue, cyan, green, indigo, lime, purple, teal,
} from "@material-ui/core/colors";
import {ClassProps} from "../../../types/shared";
import {GameContext} from "../Store";

const colors = [blue, cyan, green, indigo, lime, purple, teal];

export default withStyles({
    app: {
        backgroundColor: "#FFC20E",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
    },
    img: {
        maxWidth: "50%",
    },
    header: {
        textAlign: "center",
    },
})(function LoadingScreen({classes}: ClassProps) {
    const [{players}, {init, startGame}] = useContext(GameContext);
    init();

    return (<div className={classes.app}>
        <img src="/logo.png" alt="Telestrations logo" className={classes.img} />
        <h1 className={classes.header}>Waiting for clients to connect</h1>
        <h3>Start the game when everyone's joined!</h3>
        <List>
            {players.map((player, i) => (<ListItem key={i}>
                <ListItemIcon>
                    <PersonIcon style={{color: colors[i % colors.length][500]}} />
                </ListItemIcon>
                <ListItemText
                    primary={player.nickname}
                />
            </ListItem>))}
        </List>
        <Button onClick={startGame}
            variant="contained"
            color="primary"
            disabled={players.length < 2}
        >
            Start Game
        </Button>
    </div>);
});

