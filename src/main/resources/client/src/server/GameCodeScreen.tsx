import React, { FormEvent } from "react";
import { Button as UnstyledButton, TextField } from "@material-ui/core";
import styled from "styled-components";
import { useDispatch } from "react-redux";

import TitleScreen from "../components/TitleScreen";
import { useInput } from "../utils/hooks";
import { actions, createAndJoinGame } from "../utils/store";
import { GameState } from "../utils/types";

const Form = styled.form`
  width: 50%;
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
`;

const Button = styled(UnstyledButton)`
  margin-top: 1rem;
`;

export default function LoadingScreen() {
  const dispatch = useDispatch();
  const [gameCode, setGameCode] = useInput("");

  async function submitGameCode(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await dispatch(createAndJoinGame(gameCode));
    setGameCode(gameCode);
    dispatch(actions.setGameState(GameState.WAITING_TO_START));
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
    </TitleScreen>
  );
}
