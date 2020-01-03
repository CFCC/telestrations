import React, {createContext, ReactNode, useEffect, useReducer} from "react";
import _ from "lodash";
import uuid from 'uuid/v4';

import {ServerGameState} from "types/server";
import {FinishedGameTurnDTO, NotepadPageDTO, PlayerDTO, ServerPlayer} from "types/server";
import {Notepad} from "types/client";
import {UUID} from "types/shared";
import * as firebase from 'server/firebase';

// region [Types]

export interface State {
    state: ServerGameState;
    gameCode: string;
    serverId: UUID;
    players: Array<ServerPlayer>;
    notepads: Array<Notepad>;
    activePlayerId: UUID;
    activeNotepadId: UUID;
}

interface StoreProps {
    children: ReactNode;
}

enum ActionTypes {
    SET_GAME_CODE = "SET_GAME_CODE",
    SET_SERVER_ID = "SET_SERVER_ID",
    SET_GAME_STATE = "SET_GAME_STATE",
    VIEW_PLAYER_HISTORY = "VIEW_PLAYER_HISTORY",
    VIEW_NOTEPAD_HISTORY = "VIEW_NOTEPAD_HISTORY",
    INIT = "INIT",
    START_GAME = "START_GAME",
    PLAYER_ADDED = "PLAYER_ADDED",
    UPDATE_GUESS = "UPDATE_GUESS",
    NEW_NOTEPAD = "NEW_NOTEPAD",
    FINISHED_GAME_TURN = "FINISHED_GAME_TURN",
    GAME_FINISHED = "GAME_FINISHED",
}

interface setGameCode {
    type: ActionTypes.SET_GAME_CODE;
    gameCode: string;
}

interface setServerId {
    type: ActionTypes.SET_SERVER_ID;
    serverId: UUID;
}

interface setGameState {
    type: ActionTypes.SET_GAME_STATE;
    state: ServerGameState;
}

interface viewPlayerHistory {
    type: ActionTypes.VIEW_PLAYER_HISTORY;
    playerId: UUID;
}

interface viewNotepadHistory {
    type: ActionTypes.VIEW_NOTEPAD_HISTORY;
    ownerId: UUID;
}

interface init {
    type: ActionTypes.INIT;
}

interface startGame {
    type: ActionTypes.START_GAME;
}

interface addPlayer {
    type: ActionTypes.PLAYER_ADDED;
    player: PlayerDTO;
}

interface updateGuess {
    type: ActionTypes.UPDATE_GUESS;
    playerId: UUID;
    content: string;
}

interface finishedGameTurn {
    type: ActionTypes.FINISHED_GAME_TURN;
    playerId: UUID;
}

interface gameFinished {
    type: ActionTypes.GAME_FINISHED;
}

interface newNotepad {
    type: ActionTypes.NEW_NOTEPAD;
    playerId: UUID;
    newNotepadOwnerId: UUID;
}

type Action = setGameState | viewPlayerHistory | viewNotepadHistory | init | startGame | addPlayer | updateGuess
    | finishedGameTurn | gameFinished | newNotepad | setServerId | setGameCode;

interface Actions {
    setGameCode: (gameCode: string) => void;
    setGameState: (state: ServerGameState) => void,
    viewPlayerHistory: (playerId: UUID) => void,
    viewNotepadHistory: (ownerId: UUID) => void,
    init: () => void,
    startGame: () => void,
    addPlayer: (player: PlayerDTO) => void,
    updateGuess: (page: NotepadPageDTO) => void,
    finishedGameTurn: (playerId: UUID, newNotepadOwnerId: UUID) => void,
    gameFinished: () => void,
}

type Store = [State, Actions];

// endregion

const defaultState = {
    state: ServerGameState.GAME_CODE,
    serverId: "",
    gameCode: "",
    players: [],
    notepads: [],
    activePlayerId: "",
    activeNotepadId: "",
};

const actionStubs = {
    setGameCode: () => null,
    setGameState: () => null,
    viewPlayerHistory: () => null,
    viewNotepadHistory: () => null,
    init: () => null,
    startGame: () => null,
    addPlayer: () => null,
    updateGuess: () => null,
    finishedGameTurn: () => null,
    gameFinished: () => null,
};

export const GameContext = createContext([defaultState, actionStubs] as Store);

const defaultPlayer: ServerPlayer = {
    id: "",
    nickname: "",
    queueOfOwners: [],
    notepadIndex: 0,
    ownerOfCurrentNotepad: "",
};

const defaultNotepad: Notepad = {
    owner: "",
    content: [],
};

function reducer(state: State = defaultState, action: Action): State {
    switch (action.type) {
        case ActionTypes.SET_GAME_CODE:
            firebase.addGameToLobby(action.gameCode);
            return {...state, gameCode: action.gameCode};
        case ActionTypes.SET_SERVER_ID:
            return {...state, serverId: action.serverId};
        case ActionTypes.SET_GAME_STATE:
            return Object.assign({}, state, {
                state: action.state,
            });
        case ActionTypes.INIT:
            // io.init();
            return state;
        case ActionTypes.START_GAME:
            // io.startGame();
            return Object.assign({}, state, {
                state: ServerGameState.BIRDS_EYE,
                notepads: state.players.map(p => ({owner: p.id, content: []})),
            });
        case ActionTypes.PLAYER_ADDED: {
            const players = state.players.slice(0);
            players.push({ownerOfCurrentNotepad: action.player.id, notepadIndex: 0, queueOfOwners: [], ...action.player});
            return Object.assign({}, state, {players});
        }
        case ActionTypes.UPDATE_GUESS: {
            const notepads = state.notepads.slice(0);
            const player = state.players.find(p => p.id === action.playerId) || defaultPlayer;
            const notepad = notepads.find(n => n.owner === player.ownerOfCurrentNotepad) || defaultNotepad;
            notepad.content[player.notepadIndex] = action.content;
            return Object.assign({}, state, {notepads});
        }
        case ActionTypes.FINISHED_GAME_TURN: {
            const players = state.players.slice(0);
            Object.assign(players[_.findIndex(players, {id: action.playerId})], {
                ownerOfCurrentNotepad: "",
                notepadIndex: -1,
            });
            return Object.assign({}, state, {players});
        }
        case ActionTypes.NEW_NOTEPAD: {
            const players = state.players.slice(0);
            const newNotepad = _.find(state.notepads, {owner: action.newNotepadOwnerId});
            Object.assign(players[_.findIndex(players, {id: action.playerId})], {
                ownerOfCurrentNotepad: action.newNotepadOwnerId,
                notepadIndex: newNotepad ? newNotepad.content.length : -1,
            });
            return Object.assign({}, state, {players});
        }
        default:
            return state;
    }
}

export default function Store({children}: StoreProps) {
    const [state, dispatch] = useReducer(reducer, defaultState);
    const actions = {
        setGameCode: (gameCode: string) => dispatch({type: ActionTypes.SET_GAME_CODE, gameCode}),
        setGameState: (swgs: ServerGameState) => dispatch({
            type: ActionTypes.SET_GAME_STATE,
            state: swgs,
        } as setGameState),
        viewPlayerHistory: (playerId: UUID) => dispatch({
            type: ActionTypes.VIEW_PLAYER_HISTORY,
            playerId,
        } as viewPlayerHistory),
        viewNotepadHistory: (ownerId: UUID) => dispatch({
            type: ActionTypes.VIEW_NOTEPAD_HISTORY,
            ownerId,
        } as viewNotepadHistory),
        init: () => dispatch({
            type: ActionTypes.INIT,
        } as init),
        startGame: () => dispatch({
            type: ActionTypes.START_GAME,
        } as startGame),
        addPlayer: (player: PlayerDTO) => dispatch({
            type: ActionTypes.PLAYER_ADDED,
            player,
        } as addPlayer),
        updateGuess: ({playerId, content}: NotepadPageDTO) => dispatch({
            type: ActionTypes.UPDATE_GUESS,
            playerId,
            content,
        } as updateGuess),
        finishedGameTurn: (playerId: UUID) => dispatch({
            type: ActionTypes.FINISHED_GAME_TURN,
            playerId,
        } as finishedGameTurn),
        gameFinished: () => dispatch({
            type: ActionTypes.GAME_FINISHED,
        } as gameFinished),
        newNotepad: ({playerId, newNotepadOwnerId}: FinishedGameTurnDTO) => dispatch({
            type: ActionTypes.NEW_NOTEPAD,
            playerId,
            newNotepadOwnerId,
        } as newNotepad),
    };

    useEffect(() => {
        let serverId = localStorage.getItem('serverId');
        if (!serverId) {
            serverId = uuid();
            localStorage.setItem('serverId', serverId);
        }

        dispatch({type: ActionTypes.SET_SERVER_ID, serverId});
    }, []);

    // useEffect(() => {
        // io.attachEvents({
        //     [IOEvent.PLAYER_ADDED]: actions.addPlayer,
        //     [IOEvent.UPDATE_GUESS]: actions.updateGuess,
        //     [IOEvent.FINISHED_GAME_TURN]: actions.finishedGameTurn,
        //     [IOEvent.GAME_FINISHED]: actions.gameFinished,
        //     [IOEvent.NEW_CONTENT]: actions.newNotepad,
        // });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    return (<GameContext.Provider value={[state, actions]}>
        {children}
    </GameContext.Provider>);
};
