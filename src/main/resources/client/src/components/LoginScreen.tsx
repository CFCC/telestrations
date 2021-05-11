import React, { FormEvent, useState } from "react";

import { saveSettings, useSelector } from "../utils/store";
import { useInput } from "../utils/hooks";
import TitleScreen from "./TitleScreen";
import { createAvatar } from "@dicebear/avatars";
import * as sprites from "@dicebear/avatars-human-sprites";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { animals, colors, uniqueNamesGenerator } from "unique-names-generator";
import { Button, IconButton, TextField, Typography } from "@material-ui/core";
import { SyncOutlined as SyncIcon } from "@material-ui/icons";
import styled from "styled-components";

const FormControl = styled.div`
  &:not(:first-child) {
    margin-top: 1rem;
  }
`;

const InputGroup = styled.div`
  display: flex;
`;

const getRandomName = () =>
  uniqueNamesGenerator({
    dictionaries: [colors, animals],
    length: 2,
    separator: " ",
    style: "capital",
  });

export default function LoginScreen() {
  const { id, name: defaultName, avatar: defaultAvatar } = useSelector(
    (state) => state.settings
  );
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState(defaultAvatar ?? uuidv4());
  const [name, setName] = useInput(defaultName ?? getRandomName());

  async function handleGoToLobby(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await dispatch(saveSettings({ name, avatar, id: id || uuidv4() }));
  }

  function randomizeName() {
    setName(getRandomName());
  }

  function randomizeImage() {
    setAvatar(uuidv4());
  }

  return (
    <TitleScreen title="Log In">
      <form onSubmit={handleGoToLobby}>
        <FormControl id="image">
          <Typography>Avatar</Typography>
          <InputGroup>
            <img
              src={createAvatar(sprites, {
                seed: avatar,
                width: 150,
                height: 150,
                dataUri: true,
              })}
            />
            <IconButton onClick={randomizeImage} aria-label="Randomize Image">
              <SyncIcon />
            </IconButton>
          </InputGroup>
        </FormControl>
        <FormControl id="name">
          <Typography>Name</Typography>
          <InputGroup>
            <TextField value={name} onChange={setName} placeholder="Name" />
            <IconButton onClick={randomizeName} aria-label="Randomize Name">
              <SyncIcon />
            </IconButton>
          </InputGroup>
        </FormControl>
        <Button type="submit" color="primary">
          Go to Lobby
        </Button>
      </form>
    </TitleScreen>
  );
}
