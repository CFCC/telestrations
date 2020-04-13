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
import {ActionsObservable, createEpicMiddleware, ofType} from "redux-observable";
import {map, switchMap} from "rxjs/operators";
import * as firebase from "firebase/app";
import _ from "lodash";
import {v4 as uuid} from "uuid";
import {collectionData, docData} from "rxfire/firestore";

import {ServerGameState} from "../types/web";
import {Game, Notepad, Player} from "../types/firebase";

interface State {
    gameState: ServerGameState;
    game: Game;
    gameCode: string;
    activePlayerId: string;
    activeNotepadId: string;
}

const defaultState: State = {
    gameState: ServerGameState.GAME_CODE,
    gameCode: "",
    game: {
        players: {},
        notepads: {},
        created: firebase.firestore.Timestamp.now(),
        status: "lobby",
    },
    activePlayerId: "",
    activeNotepadId: "",
};

export const viewPlayerHistory = createAction<string>("VIEW_PLAYER_HISTORY");
export const viewNotepadHistory = createAction<string>("VIEW_NOTEPAD_HISTORY");
export const updateGame = createAction<Pick<Game, "created" | "status">>("UPDATE_GAME");
export const updateNotepads = createAction<Record<string, Notepad>>("UPDATE_NOTEPADS");
export const updatePlayers = createAction<Record<string, Player>>("UPDATE_PLAYERS");

export const setGameCode = createAsyncThunk<void, string>("SET_GAME_CODE", async gameCode => {
    await firebase
        .firestore()
        .doc(`games/${gameCode}`)
        .set({
            created: firebase.firestore.Timestamp.fromDate(new Date()),
            status: "lobby",
            serverId: localStorage.getItem('serverId') ?? '',
        } as Partial<Game>);
});
export const startGame = createAsyncThunk("START_GAME", async (_, {getState}) => {
    const {gameCode, game: {players}} = getState() as State;
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
export const gameFinished = createAsyncThunk("GAME_FINISHED", async (_, {getState}) => {
    await firebase
        .firestore()
        .doc(`games/${(getState() as State).gameCode}`)
        .set({status: "finished"} as Partial<Game>, {merge: true});
});

const reducer = createReducer(defaultState, builder => builder
    .addCase(setGameCode.fulfilled, (state, {payload: gameCode}) => _.merge(state, {gameState: ServerGameState.LOADING, gameCode}))
    .addCase(startGame.fulfilled, state => _.merge(state, {gameState: ServerGameState.BIRDS_EYE}))
    .addCase(viewPlayerHistory, (state, {payload: activePlayerId}) => _.merge(state, {activePlayerId}))
    .addCase(viewNotepadHistory, (state, {payload: activeNotepadId}) => _.merge(state, {activeNotepadId}))
    .addCase(updateGame, (state, {payload: game}) => _.merge(state, {game}))
    .addCase(updateNotepads, (state, {payload: notepads}) => _.merge(state, {game: {notepads}}))
    .addCase(updatePlayers, (state, {payload: players}) => _.merge(state, {game: {players}}))
);

const epicMiddleware = createEpicMiddleware();
const epic = (action: ActionsObservable<Action>) => action.pipe(
    ofType(setGameCode.fulfilled.type),
    map(o => firebase.firestore().doc(`games/${(o as PayloadAction).payload}`)),
    switchMap(game => merge(
        docData<Game>(game).pipe(
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

export const store = configureStore({
    reducer,
    middleware: [...getDefaultMiddleware(), epicMiddleware],
});

epicMiddleware.run(epic);

export const useSelector: TypedUseSelectorHook<ReturnType<typeof reducer>> = useUntypedSelector;
