import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import _ from "lodash";
import { v4 as uuid } from "uuid";

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

export const getGameCodes = (callback: (ids: string[]) => void) => {
  return firebase
    .firestore()
    .collection("games")
    .where("status", "==", "lobby")
    .onSnapshot(async function (snapshot) {
      const newGames = snapshot.docs.map((doc) => doc.id);
      callback(newGames);
    });
};
export const setGameCode = (gameCode: string, isClient: boolean = false) => {
  const game = firebase
    .firestore()
    .doc(`games/${gameCode}`) as DocumentReference<Partial<Game>>;

  game.onSnapshot(async (snapshot) => {
    const newGame = snapshot.data();
    if (!newGame) return;

    if (isClient) {
      if (newGame.status === "in progress") {
        store.dispatch(setGameState(GameState.IN_GAME));
      } else if (newGame.status === "finished") {
        store.dispatch(setGameState(GameState.FINISHED));
        const currentUser = firebase.auth().currentUser;
        if (currentUser?.isAnonymous) {
          await currentUser.delete();
        }
      }
    }

    store.dispatch(updateGame({ ...newGame, id: snapshot.id }));
  });
  game.collection("notepads").onSnapshot((snapshot) => {
    const notepads = _.mapValues(
      _.keyBy(snapshot.docs, "id"),
      (d) => d.data() as Notepad
    );
    store.dispatch(updateNotepads(notepads));
  });
  game.collection("players").onSnapshot(async (snapshot) => {
    const players = _.mapValues(
      _.keyBy(snapshot.docs, "id"),
      (d) => d.data() as Player
    );
    store.dispatch(updatePlayers(players));

    if (!isClient) {
      const {
        notepads,
        game: { status },
      } = store.getState().firebase;
      const gameIsOver =
        status === "in progress" &&
        Object.entries(players).every(
          ([pid, p]) => notepads[p.currentNotepad]?.ownerId === pid
        ) &&
        Object.values(notepads).every((n) => n.pages.length > 1);

      if (gameIsOver) await game.set({ status: "finished" }, { merge: true });
    } else {
      const { uid } = store.getState().client.user;
      const { currentNotepad, queue } = players[uid];

      if (!currentNotepad && queue?.length > 0) {
        const newQueue = [...queue];
        const newNotepad = newQueue.shift();

        await (firebase
          .firestore()
          .doc(`games/${gameCode}/players/${uid}`) as DocumentReference<
          Partial<Player>
        >).set(
          { queue: newQueue, currentNotepad: newNotepad },
          { merge: true }
        );
        store.dispatch(clientSlice.actions.setGameState(GameState.IN_GAME));
      }
    }
  });
};
export const startGame = async () => {
  const {
    firebase: {
      game: { id: gameCode },
      players,
    },
  } = store.getState();
  const playerIds = Object.keys(players);

  await Promise.all(
    playerIds.map(async (playerId, i) => {
      const notepadId = uuid();
      await (firebase
        .firestore()
        .doc(
          `games/${gameCode}/notepads/${notepadId}`
        ) as DocumentReference<Notepad>).set({ ownerId: playerId, pages: [] });
      await (firebase
        .firestore()
        .doc(`games/${gameCode}/players/${playerId}`) as DocumentReference<
        Partial<Player>
      >).set(
        {
          currentNotepad: notepadId,
          nextPlayer: playerIds[(i + 1) % playerIds.length],
          queue: [],
        },
        { merge: true }
      );
    })
  );
  await (firebase.firestore().doc(`games/${gameCode}`) as DocumentReference<
    Partial<Game>
  >).set({ status: "in progress" }, { merge: true });
};
export const setGuess = _.throttle(async (guess: string) => {
  const {
    client: { user },
    firebase: {
      game: { id: gameCode },
      players,
      notepads,
    },
  } = store.getState();
  const currentNotepadId = players[user.uid].currentNotepad;
  const currentNotepad = notepads[currentNotepadId];
  if (!currentNotepad) return;

  const pages = _.cloneDeep(currentNotepad.pages);
  const needsNewPage = _.last(pages)?.author !== user.uid;
  if (needsNewPage) {
    pages.push({
      author: user.uid,
      lastUpdated: new Date().getTime(),
      content: "",
    });
  }

  if (pages.length % 2 === 1) {
    pages[pages.length - 1].content = guess;
    pages[pages.length - 1].lastUpdated = new Date().getTime();
  } else {
    let fileName = _.last(pages)?.content;
    if (!fileName) {
      fileName = `${uuid()}.png`;
      pages[pages.length - 1].content = fileName;
    }

    pages[pages.length - 1].lastUpdated = new Date().getTime();
    firebase.storage().ref().child(fileName).putString(guess, "data_url");
  }

  await (firebase
    .firestore()
    .doc(`games/${gameCode}/notepads/${currentNotepadId}`) as DocumentReference<
    Partial<Notepad>
  >).set({ pages }, { merge: true });
}, 500);
export const submitGuess = async () => {
  const {
    client: { user },
    firebase: {
      game: { id: gameCode },
      players,
    },
  } = store.getState();
  const { currentNotepad, nextPlayer } = players[user.uid];
  const { queue: nextPlayerQueue } = players[nextPlayer];

  await (firebase
    .firestore()
    .doc(`games/${gameCode}/players/${nextPlayer}`) as DocumentReference<
    Partial<Player>
  >).set({ queue: [...nextPlayerQueue, currentNotepad] }, { merge: true });
  await (firebase
    .firestore()
    .doc(`games/${gameCode}/players/${user.uid}`) as DocumentReference<
    Partial<Player>
  >).set({ currentNotepad: "" }, { merge: true });
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
