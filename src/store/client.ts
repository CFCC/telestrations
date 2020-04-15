import firebase, {User} from "firebase";
import _ from "lodash";
import {
    Action,
    configureStore,
    createAction,
    createAsyncThunk,
    createReducer,
    getDefaultMiddleware, PayloadAction
} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useSelector as useUntypedSelector} from "react-redux";
import {combineEpics, createEpicMiddleware, Epic, ofType} from "redux-observable";
import {merge, of} from "rxjs";
import {filter, map, switchMap, tap} from "rxjs/operators";
import {docData} from "rxfire/firestore";

import {ClientGameState} from "../types/web";
import {Game, Notepad, Player, WithId} from "../types/firebase";
import {v4 as uuid} from "uuid";

interface State {
    user: User | null;
    gameCode: string;
    gameState: ClientGameState;
    guess: string;

    currentNotepad: WithId<Notepad> | null;
    nextPlayer: string;
    queue: string[];
}

const defaultState: State = {
    user: null,
    gameCode: "",
    gameState: ClientGameState.LOGIN,
    guess: "",

    currentNotepad: null,
    nextPlayer: "",
    queue: [],
};

export const setUser = createAction<User | null>("SET_USER");
export const gameStarted = createAction("GAME_STARTED");

const newContent = createAction<string>("NEW_CONTENT");
const gameFinished = createAction("GAME_FINISHED");
const setQueue = createAction<string[]>("SET_QUEUE");
const setCurrentNotepad = createAction<Notepad>("SET_CURRENT_NOTEPAD");

export const joinGame = createAsyncThunk<string, string>("JOIN_GAME", async (gameCode, {getState}) => {
    const {user} = getState() as State;
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
    const {user, gameCode, currentNotepad} = getState() as State;
    _.debounce(async () => {
        if (!user || !currentNotepad) return;

        const pages = _.clone(currentNotepad.pages);
        const needsNewPage = _.last(pages)?.author === user.uid;
        if (needsNewPage) {
            pages.push({
                author: user.uid,
                lastUpdated: firebase.firestore.Timestamp.fromDate(new Date()),
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
    const {user, gameCode} = getState() as State;
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

const epicMiddleware = createEpicMiddleware<Action, Action, State>();
const playerEpic: Epic<Action, Action, State> = (action, state) => action.pipe(
    ofType(joinGame.fulfilled.type),
    map(() => firebase
        .firestore()
        .doc(`games/${state.value.gameCode}/players/${state.value.user?.uid}`)
    ),
    switchMap(player => docData<Player>(player).pipe(
        switchMap(playerDoc => merge(
            of(playerDoc).pipe(
                filter(p => !_.eq(p.queue, state.value.queue)),
                map(p => setQueue(p.queue))
            ),
            of(playerDoc).pipe(
                filter(p => !_.eq(p.currentNotepad, state.value.currentNotepad)),
                switchMap(n => docData<Notepad>(firebase.firestore().doc(`games/${state.value.gameCode}/notepads/${n}`))),
                map(n => setCurrentNotepad(n))
            )
        ))
    ))
);
const waitingForQueueItemEpic: Epic<Action, Action, State> = (action, state) => action.pipe(
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

const reducer = createReducer(defaultState, builder => builder
    .addCase(joinGame.fulfilled, (state, {payload: gameCode}) => _.merge(state, {gameCode, gameState: ClientGameState.WAITING_TO_START}))
    .addCase(setGuess.fulfilled, (state, {payload: guess}) => _.merge(state, {guess}))
    .addCase(setUser, (state, {payload: user}) => _.merge(state, {user, gameState: ClientGameState.GAME_SELECTION}))
    .addCase(gameStarted, state => _.merge(state, {gameState: ClientGameState.IN_GAME}))
    .addCase(newContent, (state, {payload: content}) => _.merge(state, {gameState: ClientGameState.IN_GAME, content, guess: ""}))
    .addCase(gameFinished, state => _.merge(state, {gameState: ClientGameState.FINISHED}))
    .addCase(setQueue, (state, {payload: queue}) => _.merge(state, {queue}))
    .addCase(setCurrentNotepad, (state, {payload: currentNotepad}) => _.merge(state, {currentNotepad}))
);

export const store = configureStore({
    reducer,
    middleware: [...getDefaultMiddleware(), epicMiddleware],
});

epicMiddleware.run(combineEpics(
    playerEpic, waitingForQueueItemEpic
));

export const useSelector: TypedUseSelectorHook<ReturnType<typeof reducer>> = useUntypedSelector;
