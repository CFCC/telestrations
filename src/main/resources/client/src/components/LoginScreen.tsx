import React, { FormEvent, useEffect } from "react";
import { connectToServer, saveSettings, useSelector } from "../utils/store";
import TitleScreen from "./TitleScreen";
import { useDispatch } from "react-redux";
import {
  Button as UnstyledButton,
  IconButton,
  TextField as UnstyledTextField,
  Typography,
} from "@material-ui/core";
import { SyncOutlined as SyncIcon } from "@material-ui/icons";
import styled from "styled-components";
import { getRandomName, asImage, useAvatar } from "@piticent123/gamekit-client";
import { useInput } from "@piticent123/utils/lib/hooks"

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

export default function LoginScreen() {
  const {
    id,
    name: defaultName,
    avatar: defaultAvatar,
  } = useSelector((state) => state.gamekit.settings);
  const dispatch = useDispatch();
  const [avatar, randomizeImage] = useAvatar();
  const [name, setName] = useInput(defaultName ?? getRandomName());

  useEffect(() => {
    if (id && defaultName && defaultAvatar) {
      dispatch(connectToServer());
    }
  }, []);

  async function handleGoToLobby(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await dispatch(saveSettings({ name, avatar }));
    await dispatch(connectToServer());
  }

  function randomizeName() {
    setName(getRandomName());
  }

  return (
    <TitleScreen title="Log In">
      <Form onSubmit={handleGoToLobby}>
        <Typography variant="caption" color="textSecondary">
          Profile Picture:
        </Typography>
        <InputGroup>
          <img src={asImage(avatar)} alt="Avatar" />
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
