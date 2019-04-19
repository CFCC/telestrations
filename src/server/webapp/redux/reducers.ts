import * as Actions from './actions';
import {ClientGameState} from "../../../types";

export interface State {
    state: ClientGameState;
}

const defaultState: State = {
    state: ClientGameState.LOADING,
};

export default function reducer(state: State = defaultState, action: Actions.Creator): State {
    switch (action.type) {
        case Actions.SET_GAME_STATE:
            return Object.assign({}, state, {
                state: action.state
            });
        default:
            return state;
    }
}