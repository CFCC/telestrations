import React, { FormEvent, useEffect, useState } from "react";
import { Button as UnstyledButton, TextField } from "@material-ui/core";
import styled from "styled-components";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";

import TitleScreen from "../components/TitleScreen";
import { useEvent } from "../utils/hooks";
import { createGame, getGameCodes, setGameCode } from "../utils/firebase";
import { clientSlice, GameState, useSelector } from "../utils/store";

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
  const displayName = useSelector((state) => state.client.user.displayName);
  const [games, setGames] = useState<string[]>([]);
  const [gameCode, updateGameCode] = useEvent(
    "",
    ({ target: { value } }) => value
  );

  async function submitGameCode(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    Cookies.set("gameCode", gameCode, { expires: 0.66 });
    await createGame(gameCode);
    setGameCode(gameCode);
    dispatch(clientSlice.actions.setGameState(GameState.WAITING_TO_START));
  }

  useEffect(() => {
    const oldGameCode = Cookies.get("gameCode");
    if (oldGameCode) {
      setGameCode(oldGameCode);
      dispatch(clientSlice.actions.setGameState(GameState.WAITING_TO_START));
    }
  }, [dispatch]);

  useEffect(() => {
    return getGameCodes(function (newGames) {
      setGames(newGames);
    });
  });

  return (
    <TitleScreen
      title="Please Choose a Game Code"
      subtitle="Players will select this code from the list of available games"
    >
      <Form onSubmit={submitGameCode}>
        <TextField
          value={gameCode}
          onChange={updateGameCode}
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
        {displayName === "Jordan Pitlor" && (
          <Button
            variant="contained"
            color="primary"
            disabled={games.length === 0}
            size="large"
          >
            Clean Lobbies
          </Button>
        )}
      </Form>
    </TitleScreen>
  );
}
