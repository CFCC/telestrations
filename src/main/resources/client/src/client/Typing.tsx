import React, { ChangeEvent, FormEvent, useState } from "react";
import { Button as UnstyledButton, TextField } from "@material-ui/core";
import styled from "styled-components";
import _ from "lodash";

import { useDispatch } from "react-redux";
import { GameState } from "../utils/types";
import { actions, useSelector, submitGuess, setGuess } from "../utils/store";

interface FormProps {
  content?: string;
}

const Form = styled.form`
  width: 100%;
  height: 100%;
  background-image: ${(props: FormProps) =>
    !props.content ? "url(/question-marks.jpg)" : "none"};
  background-repeat: repeat;
  display: flex;
  align-items: flex-end;
`;

const Input = styled(TextField)`
  background: #ffffff;
  flex: 1;
  margin: 1em;
`;

const Button = styled(UnstyledButton)`
  flex-shrink: 0;
  margin: 1em;
  height: 4em;
`;

const Image = styled.img`
  position: absolute;
`;

export default function Typing() {
  const dispatch = useDispatch();
  const players = useSelector((state) => state.currentGame.players);
  const settings = useSelector((state) => state.settings);
  const currentNotepad = players.find((p) => p.id === settings.id)
    ?.notebookQueue[0];
  const content = _.nth(currentNotepad?.pages, -2)?.content;
  const guess = _.last(currentNotepad?.pages)?.content;
  const [value, setValue] = useState(guess ?? "");

  const dontRefresh = async (e: FormEvent) => {
    e.preventDefault();
    await dispatch(submitGuess(value));
    dispatch(actions.setGameState(GameState.WAITING_FOR_CONTENT));
    return false;
  };

  const updateGuess = async (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    await dispatch(setGuess(e.target.value));
  };

  return (
    <Form onSubmit={dontRefresh} content={content}>
      {content && <Image src={content} alt="Previous submission" />}
      <Input
        value={value}
        variant="outlined"
        placeholder={
          content === "" ? "Describe a scene" : "What is in this picture?"
        }
        onChange={updateGuess}
      />
      <Button variant="contained" color="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}
