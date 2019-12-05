import React, {useState, useContext} from "react";
import {
    Card, CardContent, CardHeader,
    Grid,
    Icon,
    IconButton,
    Menu,
    MenuItem,
} from "@material-ui/core";
import PlayerStream from "server/webapp/components/PlayerStream";
import {UUID} from "types/shared";
import {GameContext} from "server/webapp/Store";
import {darkPrimary, primary} from "../../../utils/theme";
import styled from "styled-components";

interface BirdsEyeState {
    anchorElement: HTMLElement | null;
    playerId: string;
}

const GridContainer = styled(Grid)`
    background: linear-gradient(180deg, ${primary} 50%, ${darkPrimary} 100%);
    padding: 32px;
    overflow: auto;
    height: 100vh;
`;

export default function BirdsEye() {
    const [{players}, {viewNotepadHistory, viewPlayerHistory}] = useContext(GameContext);
    const [menu, setMenu] = useState({
        anchorElement: null,
        playerId: "",
    } as BirdsEyeState);

    const openMenu = (id: UUID) => (e: React.MouseEvent<HTMLElement, MouseEvent>) =>
        setMenu({anchorElement: e.currentTarget, playerId: id});
    const closeMenu = () => setMenu({anchorElement: null, playerId: ""});

    return (<React.Fragment>
        <GridContainer container={true} spacing={4}>
            {players.map(player => {
                let playerState = "";
                if (player.notepadIndex === -1) playerState = "Waiting";
                else if (player.notepadIndex % 2 === 1) playerState = "Drawing";
                else /* if (player.notepadIndex % 2 === 0) */ playerState = "Writing";

                return (<Grid item={true} xs={12} sm={6} lg={4} xl={3} key={player.id}>
                    <Card>
                        <CardHeader
                            title={player.nickname}
                            subheader={`Currently ${playerState}`}
                            action={<IconButton
                                onClick={openMenu(player.id)}
                                aria-owns={menu.playerId === player.id ? "menu" : undefined}
                                aria-haspopup="true"
                            >
                                <Icon>more_vert</Icon>
                            </IconButton>}
                        />
                        <CardContent>
                            <PlayerStream playerId={player.id} />
                        </CardContent>
                    </Card>
                </Grid>)
            })}
        </GridContainer>
        <Menu
            open={Boolean(menu.anchorElement)}
            id="menu"
            onClose={closeMenu}
            anchorEl={menu.anchorElement}>
            <MenuItem onClick={() => viewPlayerHistory(menu.playerId)}>
                View Player History
            </MenuItem>
            <MenuItem onClick={() => viewNotepadHistory(menu.playerId)}>
                View Notepad History
            </MenuItem>
            <MenuItem>
                Make Stream Fullscreen (Coming Soon!)
            </MenuItem>
        </Menu>
    </React.Fragment>);
}
