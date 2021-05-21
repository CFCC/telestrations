import React, { useEffect } from "react";
import {
  Button as UnstyledButton,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField as UnstyledTextField,
} from "@material-ui/core";
import styled from "styled-components";
import { useDispatch } from "react-redux";

import TitleScreen from "../components/TitleScreen";
import { useInput } from "../utils/hooks";
import { joinGame, useSelector } from "../utils/store";

const Form = styled.form`
  width: 50%;
  display: flex;
  flex-direction: column;
`;

const Button = styled(UnstyledButton)`
  margin-top: 1rem;
`;

const TextField = styled(UnstyledTextField)`
  margin-top: 1rem;
`;

export default function GameSelection() {
  const games = useSelector((state) => state.openGames);
  const [selection, setSelection, resetSelection] = useInput("" as string);
  const [gameCode, setGameCode] = useInput("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (![...games, "New Game"].includes(selection)) resetSelection();
  }, [selection, games, resetSelection]);

  async function onSubmit() {
    await dispatch(joinGame(selection));
  }

  return (
    <TitleScreen title="Please select a game to join">
      <Form onSubmit={onSubmit}>
        <FormControl variant="outlined">
          <InputLabel id="game-label">Game Code</InputLabel>
          <Select
            labelId="game-label"
            value={selection}
            onChange={setSelection}
            label="Game Code"
          >
            <MenuItem value="">None</MenuItem>
            {games.map((gameOption) => (
              <MenuItem value={gameOption} key={gameOption}>
                {gameOption}
              </MenuItem>
            ))}
            <MenuItem value="New Game">New Game</MenuItem>
          </Select>
        </FormControl>
        {selection === "New Game" && (
          <TextField
            value={gameCode}
            onChange={setGameCode}
            placeholder="New Game Code"
            label="New Game Code"
            variant="outlined"
          />
        )}
        <Button
          onClick={onSubmit}
          variant="contained"
          color="primary"
          disabled={
            selection === "" || (selection === "New Game" && gameCode === "")
          }
          size="large"
        >
          Join Game
        </Button>
      </Form>
    </TitleScreen>
  );
}
