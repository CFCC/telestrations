import React, {useState, useContext} from "react";
import {
    Grid,
    Icon,
    IconButton,
    Menu,
    MenuItem,
    Paper,
    Typography,
    withStyles,
} from "@material-ui/core";
import Fullscreen from "react-full-screen";
import PlayerStream from "server/webapp/components/PlayerStream";
import {ClassProps, UUID} from "types/shared";
import {GameContext} from "server/webapp/Store";

interface BirdsEyeState {
    anchorElement: HTMLElement | null;
    playerId: string;
}

export default withStyles({
    app: {
        padding: "8px",
    },
    playerName: {
        textAlign: "center",
    },
})(function BirdsEye({classes}: ClassProps) {
    const [{players}, {viewNotepadHistory, viewPlayerHistory}] = useContext(GameContext);
    const [menu, setMenu] = useState({
        anchorElement: null,
        playerId: "",
    } as BirdsEyeState);
    const [fullScreenId, setFullScreenId] = useState("");

    const openMenu = (id: UUID) => (e: React.MouseEvent<HTMLElement, MouseEvent>) =>
        setMenu({anchorElement: e.currentTarget, playerId: id});

    const closeMenu = () => setMenu({anchorElement: null, playerId: ""});

    const makeFullScreen = (id: UUID) => () => setFullScreenId(id);

    const changeFullScreen = (fs: boolean) => !fs && setFullScreenId("");

    return (<div className={classes.app}>
        <Grid container={true} spacing={8}>
            {players.map(player => (<Grid item={true} xs={12} sm={6} lg={4} xl={3} key={player.id}>
                <Paper>
                    <Typography variant="h4" gutterBottom={true} className={classes.playerName}>
                        {player.nickname}
                    </Typography>
                    <Fullscreen enabled={fullScreenId === player.id} onChange={changeFullScreen}>
                        <PlayerStream playerId={player.id} />
                    </Fullscreen>
                    <IconButton onClick={openMenu(player.id)}
                        aria-owns={menu.playerId === player.id ? "menu" : undefined}
                        aria-haspopup="true">
                        <Icon>more_vert</Icon>
                    </IconButton>
                </Paper>
            </Grid>))}
        </Grid>
        <Menu open={Boolean(menu.anchorElement)}
            id="menu"
            onClose={closeMenu}
            anchorEl={menu.anchorElement}>
            <MenuItem onClick={() => viewPlayerHistory(menu.playerId)}>
                View Player History
            </MenuItem>
            <MenuItem onClick={() => viewNotepadHistory(menu.playerId)}>
                View Notepad History
            </MenuItem>
            <MenuItem onClick={makeFullScreen(menu.playerId)}>
                Make Stream Fullscreen
            </MenuItem>
        </Menu>
    </div>);
});
