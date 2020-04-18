import {
    Action,
    configureStore,
    createAction,
    createAsyncThunk,
    createReducer,
    getDefaultMiddleware,
    PayloadAction,
} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useSelector as useUntypedSelector} from "react-redux";
import {merge} from "rxjs";
import {combineEpics, createEpicMiddleware, Epic, ofType} from "redux-observable";
import {map, switchMap} from "rxjs/operators";
import * as firebase from "firebase/app";
import _ from "lodash";
import {v4 as uuid} from "uuid";
import {collectionData, docData} from "rxfire/firestore";

import {Game, Notepad, Player, WithId} from "./firebase";
import {User} from "firebase";

export enum GameState {
    // Common
    LOGIN = "login",
    GAME_CODE = "game code",

    // Server
    LOADING = "loading",
    BIRDS_EYE = "bird's eye",
    SINGLE_PLAYER = "single player",
    PLAYER_HISTORY = "player history",
    NOTEPAD_HISTORY = "notepad history",

    // Client
    WAITING_TO_START = "waiting to start",
    IN_GAME = "in game",
    FINISHED = "finished",
    ALREADY_STARTED = "already started",
    WAITING_FOR_CONTENT = "waiting for content",
}

interface State {
    game: WithId<Game>;
    client: {
        user: firebase.User | null;
        gameState: GameState;
        activePlayerId: string;
    }
}

export const defaultState: State = {
    game: {
        id: "",
        players: {},
        notepads: {},
        created: new Date().getTime(),
        status: "lobby",
    },
    client: {
        user: null,
        gameState: GameState.LOGIN,
        activePlayerId: "",
    },
};

// Server Actions
export const viewPlayerHistory = createAction<string>("VIEW_PLAYER_HISTORY");
export const viewNotepadHistory = createAction<string>("VIEW_NOTEPAD_HISTORY");
export const setGameCode = createAsyncThunk<void, string>("SET_GAME_CODE", async gameCode => {
    await firebase
        .firestore()
        .doc(`games/${gameCode}`)
        .set({
            created: new Date().getTime(),
            status: "lobby",
            serverId: localStorage.getItem('serverId') ?? '',
        } as Partial<Game>);
});
export const startGame = createAsyncThunk("START_GAME", async (_, {getState}) => {
    const {game: {id: gameCode, players}} = getState() as State;
    const playerIds = Object.keys(players);

    await Promise.all(playerIds.map(async (playerId, i) => {
        const notepadId = uuid();
        await firebase
            .firestore()
            .doc(`games/${gameCode}/notepads/${notepadId}`)
            .set({
                ownerId: playerId,
                pages: [],
            } as Notepad);
        await firebase
            .firestore()
            .doc(`games/${gameCode}/players/${playerId}`)
            .set({
                currentNotepad: notepadId,
                nextPlayer: playerIds[(i + 1) % playerIds.length],
                queue: [],
            }, {merge: true});
    }));

    await firebase
        .firestore()
        .doc(`games/${gameCode}`)
        .set({status: "in progress"} as Partial<Game>, {merge: true});
});

const updateGame = createAction<Pick<Game, "created" | "status">>("UPDATE_GAME");
const updateNotepads = createAction<Record<string, Notepad>>("UPDATE_NOTEPADS");
const updatePlayers = createAction<Record<string, Player>>("UPDATE_PLAYERS");
const finishGame = createAsyncThunk("GAME_FINISHED", async (_, {getState}) => {
    await firebase
        .firestore()
        .doc(`games/${(getState() as State).game.id}`)
        .set({status: "finished"} as Partial<Game>, {merge: true});
});

// Client Actions
export const setUser = createAction<User | null>("SET_USER");
export const joinGame = createAsyncThunk<string, string>("JOIN_GAME", async (gameCode, {getState}) => {
    const {client: {user}} = getState() as State;
    if (!user) return gameCode;

    await firebase
        .firestore()
        .collection(`games/${gameCode}/players`)
        .doc(user.uid)
        .set({name: user.displayName});

    // firebase
    //     .firestore()
    //     .doc(`games/${gameCode}`)
    //     .onSnapshot(snapshot => {
    //         if ((snapshot.data() as Game).status === "in progress") callback();
    //     });

    return gameCode;
});
export const setGuess = createAsyncThunk<string, string>("SET_GUESS", async (guess, {getState}) => {
    const {client: {user}, game: {id: gameCode, players, notepads}} = getState() as State;

    if (!user) return guess;
    const notepad = players[user.uid].currentNotepad;
    const currentNotepad = notepads[notepad];

    _.debounce(async () => {
        if (!currentNotepad) return;

        const pages = _.clone(currentNotepad.pages);
        const needsNewPage = _.last(pages)?.author === user.uid;
        if (needsNewPage) {
            pages.push({
                author: user.uid,
                lastUpdated: new Date().getTime(),
                content: "",
            });
        }

        if (pages.length % 2 === 0) {
            pages[pages.length - 1].content = guess;
        } else {
            let fileName = _.last(pages)?.content;
            if (!fileName) {
                fileName = `${uuid()}.png`;
                pages[pages.length - 1].content = fileName
            }

            firebase
                .storage()
                .ref()
                .child(fileName)
                .putString(guess, "data_url");
        }

        const player = (await firebase
            .firestore()
            .doc(`games/${gameCode}/players/${user.uid}`)
            .get())
            .data() as Player;
        await firebase
            .firestore()
            .doc(`games/${gameCode}/notepads/${player.currentNotepad}`)
            .set({pages}, {merge: true});
    }, 1000);
    return guess;
});
export const submitGuess = createAsyncThunk("SUBMIT_GUESS", async (__, {getState}) => {
    const {client: {user}, game: {id: gameCode}} = getState() as State;
    if (!user) return;

    const playerRef = firebase
        .firestore()
        .doc(`games/${gameCode}/players/${user.uid}`);
    const {currentNotepad, nextPlayer} = (await playerRef.get()).data() as Player;

    const nextPlayerRef = firebase
        .firestore()
        .doc(`games/${gameCode}/players/${nextPlayer}`);
    const {queue: nextPlayerQueue} = (await nextPlayerRef.get()).data() as Player;

    await nextPlayerRef.set({queue: [...nextPlayerQueue, currentNotepad]}, {merge: true});
});

const gameStarted = createAction("GAME_STARTED");
const gameFinished = createAction("GAME_FINISHED");
const newContent = createAction<string>("NEW_CONTENT");


const reducer = createReducer(defaultState, builder => builder
    // Server Reducers
    .addCase(setGameCode.fulfilled, (state, {payload: gameCode}) => _.merge(state, {gameState: GameState.LOADING, gameCode}))
    .addCase(startGame.fulfilled, state => _.merge(state, {gameState: GameState.BIRDS_EYE}))
    .addCase(viewPlayerHistory, (state, {payload: activePlayerId}) => _.merge(state, {activePlayerId}))
    .addCase(viewNotepadHistory, (state, {payload: activeNotepadId}) => _.merge(state, {activeNotepadId}))
    .addCase(updateGame, (state, {payload: game}) => _.merge(state, {game}))
    .addCase(updateNotepads, (state, {payload: notepads}) => _.merge(state, {game: {notepads}}))
    .addCase(updatePlayers, (state, {payload: players}) => _.merge(state, {game: {players}}))

    // Client Reducers
    .addCase(joinGame.fulfilled, (state, {payload: gameCode}) => _.merge(state, {gameCode, gameState: GameState.WAITING_TO_START}))
    .addCase(setGuess.fulfilled, (state, {payload: guess}) => _.merge(state, {guess}))
    .addCase(setUser, (state, {payload: user}) => _.merge(state, {user, gameState: GameState.GAME_CODE}))
    .addCase(gameStarted, state => _.merge(state, {gameState: GameState.IN_GAME}))
    .addCase(newContent, (state, {payload: content}) => _.merge(state, {gameState: GameState.IN_GAME, content, guess: ""}))
    .addCase(gameFinished, state => _.merge(state, {gameState: GameState.FINISHED}))
);

const epicMiddleware = createEpicMiddleware<Action, Action, State>();
const updateGameEpic: Epic<Action, Action, State> = (action) => action.pipe(
    ofType(setGameCode.fulfilled.type),
    map(o => firebase.firestore().doc(`games/${(o as PayloadAction).payload}`)),
    switchMap(game => merge(
        docData<Game>(game, "id").pipe(
            map(updateGame)
        ),
        collectionData<Notepad>(game.collection("notepads"), "id").pipe(
            map(notepads => _.keyBy(notepads, "id")),
            map(updateNotepads)
        ),
        collectionData<Player>(game.collection("players"), "id").pipe(
            map(players => _.keyBy(players, "id")),
            map(updatePlayers)
        )
    ))
);
const waitingForQueueItemEpic: Epic<Action, Action, State> = (action) => action.pipe(
    ofType(submitGuess.fulfilled),
    // switchMap(() =>
    //     docData<Player>(firebase
    //         .firestore()
    //         .doc(`games/${state.value.gameCode}/players/${state.value.user?.uid}`)
    //     ).pipe(
    //         filter(u => u.queue.length > 0),
    //         tap(p => {
    //
    //         }),
    //         map()
    //     )
    // )
);
const rootEpic = combineEpics<Action, Action, State>(updateGameEpic, waitingForQueueItemEpic);

export const store = configureStore({
    reducer,
    middleware: [...getDefaultMiddleware(), epicMiddleware],
});
epicMiddleware.run(rootEpic);

export const useSelector: TypedUseSelectorHook<State> = useUntypedSelector;
