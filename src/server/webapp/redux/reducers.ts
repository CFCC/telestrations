import * as Actions from './actions';
import {ServerWebAppGameState, UUID} from "../../../types";

export interface State {
    state: ServerWebAppGameState;
    players: Array<UUID>;
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
        default:
            return state;
    }
}