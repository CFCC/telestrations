import React, { FormEvent, useEffect } from "react";
import {
  Button as UnstyledButton,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { useInput } from "@piticent123/utils/lib/hooks"
import styled from "styled-components";
import { useDispatch } from "react-redux";

import TitleScreen from "../components/TitleScreen";
import { joinGame, useSelector } from "../utils/store";

const Form = styled.form`
  width: 50%;
  display: flex;
  flex-direction: column;
`;

const Button = styled(UnstyledButton)`
  margin-top: 1rem;
`;

export default function GameSelection() {
  const games = useSelector((state) => state.gamekit.openGames);
  const [selection, setSelection, resetSelection] = useInput("" as string);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!games.includes(selection)) resetSelection();
  }, [selection, games, resetSelection]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await dispatch(joinGame(selection));
    return false;
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
          </Select>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={selection === ""}
          size="large"
        >
          Join Game
        </Button>
      </Form>
    </TitleScreen>
  );
}
