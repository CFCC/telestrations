import React, { FormEvent, useEffect, useState } from "react";
import { actions, goToLobby, saveSettings, useSelector } from "../utils/store";
import { useInput } from "../utils/hooks";
import TitleScreen from "./TitleScreen";
import { createAvatar } from "@dicebear/avatars";
import * as sprites from "@dicebear/avatars-human-sprites";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { animals, colors, uniqueNamesGenerator } from "unique-names-generator";
import {
  Button as UnstyledButton,
  IconButton,
  TextField as UnstyledTextField,
  Typography,
} from "@material-ui/core";
import { SyncOutlined as SyncIcon } from "@material-ui/icons";
import styled from "styled-components";

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 3rem;
`;

const TextField = styled(UnstyledTextField)`
  margin-right: 1rem;
`;

const Button = styled(UnstyledButton)`
  margin-bottom: 3rem;
`;

const getRandomName = () =>
  uniqueNamesGenerator({
    dictionaries: [colors, animals],
    length: 2,
    separator: " ",
    style: "capital",
  });

export default function LoginScreen() {
  const {
    id,
    name: defaultName,
    avatar: defaultAvatar,
  } = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState(defaultAvatar ?? uuidv4());
  const [name, setName] = useInput(defaultName ?? getRandomName());

  useEffect(() => {
    if (id && defaultName && defaultAvatar) {
      dispatch(goToLobby());
    }
  }, []);

  async function handleGoToLobby(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await dispatch(saveSettings({ name, avatar, id: id || uuidv4() }));
    await dispatch(goToLobby());
  }

  function randomizeName() {
    setName(getRandomName());
  }

  function randomizeImage() {
    setAvatar(uuidv4());
  }

  return (
    <TitleScreen title="Log In">
      <Form onSubmit={handleGoToLobby}>
        <Typography variant="caption" color="textSecondary">
          Profile Picture:
        </Typography>
        <InputGroup>
          <img
            src={createAvatar(sprites, {
              seed: avatar,
              width: 150,
              height: 150,
              dataUri: true,
            })}
            alt="Avatar"
          />
          <IconButton onClick={randomizeImage} aria-label="Randomize Image">
            <SyncIcon />
          </IconButton>
        </InputGroup>
        <InputGroup>
          <TextField
            value={name}
            onChange={setName}
            placeholder="Name"
            label="Name"
            variant="outlined"
          />
          <IconButton onClick={randomizeName} aria-label="Randomize Name">
            <SyncIcon />
          </IconButton>
        </InputGroup>
        <Button type="submit" color="primary" variant="contained">
          Go to Lobby
        </Button>
      </Form>
    </TitleScreen>
  );
}
