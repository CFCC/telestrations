import React, {useState} from "react";
import {
    Card, CardContent, CardHeader,
    Grid,
    Icon,
    IconButton,
    Menu,
    MenuItem,
} from "@material-ui/core";
import styled from "styled-components";
import {useDispatch} from "react-redux";

import {clientSlice, useSelector} from "../utils/store";
import PlayerStream from "./PlayerStream";

interface BirdsEyeState {
    anchorElement: HTMLElement | null;
    playerId: string;
}

const Content = styled(CardContent)`
    padding: 0;
`;

const StyledGrid = styled(Grid)`
    padding: 16px;
`;

export default function BirdsEye() {
    const {players, notepads} = useSelector(state => state.firebase);
    const dispatch = useDispatch();
    const [menu, setMenu] = useState({
        anchorElement: null,
        playerId: "",
    } as BirdsEyeState);

    const closeMenu = () => {
        setMenu({anchorElement: null, playerId: ""});
    };
    const handleViewPlayerHistory = () => {
        dispatch(clientSlice.actions.viewPlayerHistory(menu.playerId));
    };
    const handleViewNotepadHistory = () => {
        dispatch(clientSlice.actions.viewNotepadHistory(notepads[players[menu.playerId].currentNotepad].ownerId));
    };

    return (
        <React.Fragment>
            <StyledGrid container={true} spacing={4}>
                {Object.entries(players).map(([id, player]) => {
                    let playerState: string;

                    if (!player.currentNotepad)
                        playerState = "Drawing";
                    else if (notepads[player.currentNotepad]?.pages?.length % 2 === 1)
                        playerState = "Writing";
                    else
                        playerState = "Drawing";

                    function openMenu(e: React.MouseEvent<HTMLElement, MouseEvent>) {
                        setMenu({anchorElement: e.currentTarget, playerId: id});
                    }

                    return (
                        <Grid item={true} xs={12} sm={6} lg={4} xl={3} key={id}>
                            <Card>
                                <CardHeader
                                    title={player.name}
                                    subheader={`Currently ${playerState}`}
                                    action={(
                                        <IconButton
                                            onClick={openMenu}
                                            aria-owns={menu.playerId === id ? "menu" : undefined}
                                            aria-haspopup="true"
                                        >
                                            <Icon>more_vert</Icon>
                                        </IconButton>
                                    )}
                                />
                                <Content>
                                    <PlayerStream playerId={id} />
                                </Content>
                            </Card>
                        </Grid>
                    );
                })}
            </StyledGrid>
            <Menu
                open={!!menu.anchorElement}
                id="menu"
                onClose={closeMenu}
                anchorEl={menu.anchorElement}
            >
                <MenuItem onClick={handleViewPlayerHistory}>
                    View Player History
                </MenuItem>
                <MenuItem onClick={handleViewNotepadHistory}>
                    View Notepad History
                </MenuItem>
                <MenuItem>
                    Make Stream Fullscreen (Coming Soon!)
                </MenuItem>
            </Menu>
        </React.Fragment>
    );
}
