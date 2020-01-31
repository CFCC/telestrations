import _ from "lodash";
import { createContext } from "react";

import * as firebase from "firebase-client/server";
import { ServerGameState, ServerPlayer, PlayerDTO, NotepadPageDTO } from "types/server";
import { Notepad } from "types/client";
import { UUID } from "types/shared";
import { State, Action, ActionTypes, viewPlayerHistory, viewNotepadHistory, startGame, addPlayer, updateGuess, finishedGameTurn, gameFinished, Store, Actions, setGameCode } from "store/server.types";

export const initialState: State = {
    gameState: ServerGameState.GAME_CODE,
    serverId: "",
    gameCode: "",
    players: [],
    notepads: [],
    activePlayerId: "",
    activeNotepadId: "",
};

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

export function reducer(state: State, action: Action): State {
    switch (action.type) {
        case ActionTypes.SET_GAME_CODE:
            firebase.addGameToLobby(action.gameCode);
            return {...state, gameCode: action.gameCode, gameState: ServerGameState.LOADING};
        case ActionTypes.SET_SERVER_ID:
            return {...state, serverId: action.serverId};
        case ActionTypes.START_GAME:
            // io.startGame();
            return {
                ...state,
                gameState: ServerGameState.BIRDS_EYE,
                notepads: state.players.map(p => ({owner: p.id, content: []})),
            };
        case ActionTypes.PLAYER_ADDED: {
            const players = state.players.slice(0);
            players.push({ownerOfCurrentNotepad: action.player.id, notepadIndex: 0, queueOfOwners: [], ...action.player});
            return {...state, players};
        }
        case ActionTypes.UPDATE_GUESS: {
            const notepads = state.notepads.slice(0);
            const player = state.players.find(p => p.id === action.playerId) || defaultPlayer;
            const notepad = notepads.find(n => n.owner === player.ownerOfCurrentNotepad) || defaultNotepad;
            notepad.content[player.notepadIndex] = action.content;
            return {...state, notepads};
        }
        case ActionTypes.FINISHED_GAME_TURN: {
            const players = state.players.slice(0);
            Object.assign(players[_.findIndex(players, {id: action.playerId})], {
                ownerOfCurrentNotepad: "",
                notepadIndex: -1,
            });
            return {...state, players};
        }
        case ActionTypes.NEW_NOTEPAD: {
            const players = state.players.slice(0);
            const newNotepad = _.find(state.notepads, {owner: action.newNotepadOwnerId});
            Object.assign(players[_.findIndex(players, {id: action.playerId})], {
                ownerOfCurrentNotepad: action.newNotepadOwnerId,
                notepadIndex: newNotepad ? newNotepad.content.length : -1,
            });
            return {...state, players};
        }
        default:
            return state;
    }
}

export const actionCreators: Actions = {
    setGameCode: (gameCode: string) => ({type: ActionTypes.SET_GAME_CODE, gameCode} as setGameCode),
    viewPlayerHistory: (playerId: UUID) => ({type: ActionTypes.VIEW_PLAYER_HISTORY, playerId} as viewPlayerHistory),
    viewNotepadHistory: (ownerId: UUID) => ({type: ActionTypes.VIEW_NOTEPAD_HISTORY, ownerId} as viewNotepadHistory),
    startGame: () => ({type: ActionTypes.START_GAME} as startGame),
    addPlayer: (player: PlayerDTO) => ({type: ActionTypes.PLAYER_ADDED, player} as addPlayer),
    updateGuess: ({playerId, content}: NotepadPageDTO) => ({type: ActionTypes.UPDATE_GUESS, playerId, content} as updateGuess),
    finishedGameTurn: (playerId: UUID) => ({type: ActionTypes.FINISHED_GAME_TURN, playerId} as finishedGameTurn),
    gameFinished: () => ({type: ActionTypes.GAME_FINISHED} as gameFinished),
    // newNotepad: ({playerId, newNotepadOwnerId}: FinishedGameTurnDTO) => ({type: ActionTypes.NEW_NOTEPAD, playerId, newNotepadOwnerId} as newNotepad),
};

export const GameContext = createContext([initialState, actionCreators] as Store);