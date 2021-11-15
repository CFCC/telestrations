import React, { FormEvent, MouseEvent } from "react";
import {
  Button as UnstyledButton,
  List as UnstyledList,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@material-ui/core";
import { useInput } from ".yalc/@piticent123/utils/lib/hooks"
import styled from "styled-components";
import { useDispatch } from "react-redux";

import TitleScreen from "../components/TitleScreen";
import { createGame } from "../utils/store";

const Form = styled.form`
  width: 50%;
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
`;

const Button = styled(UnstyledButton)`
  margin-top: 1rem;
`;

const Subtitle = styled(Typography)`
  margin: 3rem 0 0.5rem;
  font-weight: bold;
`;

const List = styled(UnstyledList)`
  margin-top: 1rem;
  border: 1px solid black;
  border-radius: 15px;
  width: 50%;
`;

export default function LoadingScreen() {
  const dispatch = useDispatch();
  const [gameCode, setGameCode] = useInput("");
  const orphanedGames = ["hi", "hello", "yoooo"];

  async function submitGameCode(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await dispatch(createGame(gameCode));
    setGameCode(gameCode);
  }

  function handleSelectOrphanedGame(e: MouseEvent<HTMLDivElement>) {
    const orphanedGameCode = (e.target as HTMLDivElement).innerText;
  }

  return (
    <TitleScreen
      title="Please Choose a Game Code"
      subtitle="Players will select this code from the list of available games"
    >
      <Form onSubmit={submitGameCode}>
        <TextField
          value={gameCode}
          onChange={setGameCode}
          label="Game Code"
          variant="outlined"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={gameCode.length === 0}
          size="large"
        >
          Open Lobby
        </Button>
      </Form>
      {orphanedGames.length > 0 && (
        <>
          <Subtitle>Looking to become the admin of an orphaned game?</Subtitle>
          <Typography>Here is a list of available games</Typography>
          <List aria-label="orphaned games">
            {orphanedGames.map((game) => (
              <ListItem button onClick={handleSelectOrphanedGame} key={game}>
                <ListItemText primary={game} />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </TitleScreen>
  );
}
