import React, {createContext, useReducer, ReactNode} from "react";
import * as io from "./socket-io";
import {ServerWebAppGameState} from "../../types/server-webapp";
import {FinishedGameTurnDTO, NotepadPageDTO, PlayerDTO, ServerPlayer} from "../../types/server";
import {Notepad} from "../../types/client";
import {IOEvent, UUID} from "../../types/shared";

// region [Types]

export interface State {
    state: ServerWebAppGameState;
    players: Array<ServerPlayer>;
    notepads: Array<Notepad>;
    activePlayerId: UUID;
    activeNotepadId: UUID;
}

interface StoreProps {
    children: ReactNode;
}

enum ActionTypes {
    SET_GAME_STATE = "SET_GAME_STATE",
    VIEW_PLAYER_HISTORY = "VIEW_PLAYER_HISTORY",
    VIEW_NOTEPAD_HISTORY = "VIEW_NOTEPAD_HISTORY",
    INIT = "INIT",
    START_GAME = "START_GAME",
    PLAYER_ADDED = "PLAYER_ADDED",
    UPDATE_GUESS = "UPDATE_GUESS",
    FINISHED_GAME_TURN = "FINISHED_GAME_TURN",
    GAME_FINISHED = "GAME_FINISHED",
}

interface setGameState {
    type: ActionTypes.SET_GAME_STATE;
    state: ServerWebAppGameState;
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
    newNotepadOwnerId: UUID;
}

interface gameFinished {
    type: ActionTypes.GAME_FINISHED;
}

type Action = setGameState | viewPlayerHistory | viewNotepadHistory | init | startGame | addPlayer | updateGuess
    | finishedGameTurn | gameFinished;

interface Actions {
    setGameState: (state: ServerWebAppGameState) => void,
    viewPlayerHistory: (playerId: UUID) => void,
    viewNotepadHistory: (ownerId: UUID) => void,
    init: () => void,
    startGame: () => void,
    addPlayer: (player: PlayerDTO) => void,
    updateGuess: (playerId: UUID, content: string) => void,
    finishedGameTurn: (playerId: UUID, newNotepadOwnerId: UUID) => void,
    gameFinished: () => void,
}

type Store = [State, Actions];

// endregion

const defaultState = {
    state: ServerWebAppGameState.LOADING,
    players: [],
    notepads: [],
    activePlayerId: "",
    activeNotepadId: "",
};

const actionStubs = {
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

export default function Store({children}: StoreProps) {
    function reducer(state: State = defaultState, action: Action): State {
        switch (action.type) {
            case ActionTypes.SET_GAME_STATE:
                return Object.assign({}, state, {
                    state: action.state,
                });
            case ActionTypes.INIT:
                io.init();
                return state;
            case ActionTypes.START_GAME:
                io.startGame();
                return Object.assign({}, state, {
                    state: ServerWebAppGameState.BIRDS_EYE,
                    notepads: state.players.map(p => ({owner: p.id, content: []})),
                });
            case ActionTypes.PLAYER_ADDED: {
                const players = state.players.slice(0);
                players.push({ownerOfCurrentNotepad: action.player.id, notepadIndex: 0, queueOfOwners: [], ...action.player});
                return Object.assign({}, state, {players});
            }
            case ActionTypes.UPDATE_GUESS: {
                const notepads = state.notepads.slice(0);
                const playerIndex = state.players.findIndex(p => p.id === action.playerId);
                const notepadIndex = notepads
                    .findIndex(n => n.owner === state.players[playerIndex].ownerOfCurrentNotepad);
                notepads[notepadIndex].content[state.players[playerIndex].notepadIndex] = action.content;
                return Object.assign({}, state, {notepads});
            }
            case ActionTypes.FINISHED_GAME_TURN: {
                const players = state.players.slice(0);
                const playerIndex = players.findIndex(p => p.id === action.playerId);
                players[playerIndex].ownerOfCurrentNotepad = action.newNotepadOwnerId;
                const notepadIndex = state.notepads.findIndex(n => n.owner === action.newNotepadOwnerId);
                players[playerIndex].notepadIndex = state.notepads[notepadIndex].content.length; // TODO: Trouble spot
                return Object.assign({}, state, {players});
            }
            case ActionTypes.GAME_FINISHED:
                return state;
            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(reducer, defaultState);
    
    const actions = {
        setGameState: (swgs: ServerWebAppGameState) => dispatch({
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
        updateGuess: (playerId: UUID, content: string) => dispatch({
            type: ActionTypes.UPDATE_GUESS,
            playerId,
            content,
        } as updateGuess),
        finishedGameTurn: (playerId: UUID, newNotepadOwnerId: UUID) => dispatch({
            type: ActionTypes.FINISHED_GAME_TURN,
            playerId,
            newNotepadOwnerId,
        } as finishedGameTurn),
        gameFinished: () => dispatch({
            type: ActionTypes.GAME_FINISHED,
        } as gameFinished),
    };

    io.attachEvents({
        [IOEvent.PLAYER_ADDED]: actions.addPlayer,
        [IOEvent.UPDATE_GUESS]: (content: NotepadPageDTO) => actions.updateGuess(content.playerId, content.content),
        [IOEvent.FINISHED_GAME_TURN]: (content: FinishedGameTurnDTO) => actions.finishedGameTurn(content.playerId, content.newNotepadOwnerId),
        [IOEvent.GAME_FINISHED]: actions.gameFinished,
    });

    return (<GameContext.Provider value={[state, actions]}>
        {children}
    </GameContext.Provider>);
};
