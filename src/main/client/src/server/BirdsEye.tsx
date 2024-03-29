import React, { useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import styled from "styled-components";
import { useDispatch } from "react-redux";

import { useSelector, viewNotepadHistory, viewPlayerHistory } from "../utils/store";
import PlayerStream from "./PlayerStream";
import * as theme from "../utils/theme";

interface BirdsEyeState {
  anchorElement: HTMLElement | null;
  playerId: string;
}

const Header = styled.div`
  background-color: ${theme.secondary};
  color: white;
  width: calc(100% - 4rem);
  height: 2rem;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 2rem !important;
`;

const Content = styled(CardContent)`
  padding: 0;
`;

const StyledGrid = styled(Grid)`
  padding: 16px;
  width: 100%;
`;

export default function BirdsEye() {
  const currentGame = useSelector((state) => state.gamekit.currentGame);
  const dispatch = useDispatch();
  const [menu, setMenu] = useState({
    anchorElement: null,
    playerId: "",
  } as BirdsEyeState);
  const fullScreenUser = useRef<HTMLDivElement>(null);

  const closeMenu = () => {
    setMenu({ anchorElement: null, playerId: "" });
  };
  const handleViewPlayerHistory = () => {
    dispatch(viewPlayerHistory(menu.playerId));
  };
  const handleViewNotepadHistory = () => {
    dispatch(
      viewNotepadHistory(
        currentGame.players.find((p) => p.settings.id === menu.playerId)
          ?.notebookQueue[0]?.originalOwnerId ?? ""
      )
    );
  };
  const handleViewFullScreen = () => {
    fullScreenUser.current?.requestFullscreen();
    closeMenu();
  };

  return (
    <React.Fragment>
      <Header>
        <Typography>Game Code: {currentGame.code}</Typography>
        <Typography variant="h5">Birds Eye View</Typography>
      </Header>
      <StyledGrid container={true} spacing={2}>
        {Object.entries(currentGame.players).map(([id, player]) => {
          let playerState: string;

          if (!player.notebookQueue[0]) playerState = "Drawing";
          else if (player.notebookQueue[0]?.pages?.length % 2 === 1)
            playerState = "Writing";
          else playerState = "Drawing";

          function openMenu(e: React.MouseEvent<HTMLElement, MouseEvent>) {
            setMenu({ anchorElement: e.currentTarget, playerId: id });
          }

          return (
            <Grid item={true} xs={12} sm={6} lg={4} xl={3} key={id}>
              <Card ref={id === menu.playerId ? fullScreenUser : undefined}>
                <CardHeader
                  title={player.settings.name}
                  subheader={`Currently ${playerState}`}
                  action={
                    <IconButton
                      onClick={openMenu}
                      aria-owns={menu.playerId === id ? "menu" : undefined}
                      aria-haspopup="true"
                    >
                      <Icon>more_vert</Icon>
                    </IconButton>
                  }
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
        <MenuItem onClick={handleViewFullScreen}>
          Make Stream Fullscreen
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
