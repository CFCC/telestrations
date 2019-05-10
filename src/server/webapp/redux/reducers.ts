import * as Actions from './actions';
import * as io from '../socket-io';
import {PlayerDTO, ServerWebAppGameState, UUID} from "../../../types";

export interface State {
    state: ServerWebAppGameState;
    players: Array<PlayerDTO>;
    activePlayerId: UUID;
    activeNotepadId: UUID;
}

const defaultState: State = {
    state: ServerWebAppGameState.LOADING,
    players: [],
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
            return state;
        case Actions.START_GAME:
            io.startGame();
            return state;
        case Actions.PLAYER_ADDED:
            const players = state.players.slice(0);
            players.push(action.player);

            return Object.assign({}, state, {players});
        default:
            return state;
    }
}