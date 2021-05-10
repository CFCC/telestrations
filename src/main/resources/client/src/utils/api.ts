import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import _ from "lodash";

import { store, actions, rejoinGame } from "./store";
import { Game, Settings } from "./types";

const client = new Client({
  webSocketFactory: () => new SockJS(`${location.origin}/websocket-server`),
});
client.onConnect = () => {
  client.subscribe("/topic/rejoin-game", ({ body }) => {
    store.dispatch(rejoinGame(body));
  });

  client.subscribe("/topic/games", ({ body }) => {
    const response = JSON.parse(body) as string[];
    store.dispatch(actions.handleGamesListMessage(response));
  });

  client.subscribe(`/user/topic/errors/client`, ({ body }) => {
    store.dispatch(actions.handleRequestException(body));
  });

  client.subscribe(`/user/topic/errors/server`, ({ body }) => {
    store.dispatch(actions.handleServerException(body));
  });

  client.subscribe(`/user/topic/successes`, ({ body }) => {
    store.dispatch(actions.handleSuccess(body));
  });
};

export const startGame = async (gameCode: string) => {
  if (!gameCode) return;

  client.publish({ destination: `/app/games/${gameCode}/start` });
};

export const setGuess = _.throttle(async (gameCode: string, guess: string) => {
  if (!gameCode) return;

  client.publish({
    destination: `/app/games/${gameCode}/page/write`,
    body: guess,
  });
}, 500);

export const submitGuess = async (gameCode: string, guess: string) => {
  if (!gameCode) return;

  client.publish({
    destination: `/app/games/${gameCode}/page/submit`,
    body: guess,
  });
};

export function updateSettings(code: string, settings: Settings) {
  if (!code) return;

  client.publish({
    destination: `/app/games/${code}/update`,
    body: JSON.stringify(settings),
  });
}

export function connectToServer(uuid: string) {
  client.connectHeaders = { uuid };
  client.activate();
}

export function createGame(code: string) {
  client.publish({ destination: `/app/games/${code}/create` });
}

export async function joinGame(
  code: string,
  settings: Settings,
  rejoining: boolean = false
) {
  if (!rejoining) {
    client.publish({
      destination: `/app/games/${code}/join`,
      body: JSON.stringify(settings),
    });
  }

  // A race condition happens where if we dont wait 1ms, the subscription may happen first
  // giving an error that the game doesn't exist
  await new Promise((resolve) => setTimeout(resolve, 1));

  client.subscribe(`/topic/games/${code}`, ({ body }) => {
    const response = JSON.parse(body) as Game;
    store.dispatch(actions.handleGameUpdate(response));
  });
}
