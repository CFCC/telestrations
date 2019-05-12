import * as Actions from './actions';
import * as io from '../socket-io';
import {Notepad, ServerPlayer, ServerWebAppGameState, UUID} from "../../../types";

export interface State {
    state: ServerWebAppGameState;
    players: Array<ServerPlayer>;
    notepads: Array<Notepad>;
    activePlayerId: UUID;
    activeNotepadId: UUID;
}

const defaultState: State = {
    state: ServerWebAppGameState.LOADING,
    players: [],
    notepads: [],
    activePlayerId: '',
    activeNotepadId: ''
};

export default function reducer(state: State = defaultState, action: Actions.Action): State {
    switch (action.type) {
        case Actions.SET_GAME_STATE:
            return Object.assign({}, state, {
                state: action.state
            });
        case Actions.INIT:
            io.init();
            return Object.assign({}, state, {
                notepads: state.players.map(p => ({owner: p.id, content: []}))
            });
        case Actions.START_GAME:
            io.startGame();
            return Object.assign({}, state, {state: ServerWebAppGameState.BIRDS_EYE});
        case Actions.PLAYER_ADDED: {
            const players = state.players.slice(0);
            players.push({ownerOfCurrentNotepad: action.player.id, notepadIndex: 0, ...action.player});
            return Object.assign({}, state, {players});
        }
        case Actions.UPDATE_GUESS: {
            const notepads = state.notepads.slice(0);
            const playerIndex = state.players.findIndex(p => p.id === action.playerId);
            const notepadIndex = notepads
                .findIndex(n => n.owner === state.players[playerIndex].ownerOfCurrentNotepad);
            notepads[notepadIndex].content[state.players[playerIndex].notepadIndex] = action.content;
            return Object.assign({}, state, {notepads});
        }
        case Actions.FINISHED_GAME_TURN: {
            const players = state.players.slice(0);
            const playerIndex = players.findIndex(p => p.id === action.playerId);
            players[playerIndex].ownerOfCurrentNotepad = action.newNotepadOwnerId;
            const notepadIndex = state.notepads.findIndex(n => n.owner === action.newNotepadOwnerId);
            players[playerIndex].notepadIndex = state.notepads[notepadIndex].content.length;
            return Object.assign({}, state, {players});
        }
        case Actions.GAME_FINISHED:
            return state;
        default:
            return state;
    }
}