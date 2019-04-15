import * as configCreators from '../creators/config';
import * as configActions from '../actions/config';
import {GameState} from "../../../types";

export interface Config {
    state: GameState;
}

const defaultState: Config = {
    state: GameState.LOADING,
};

export default function configReducer(state: Config = defaultState, action: configCreators.ConfigCreator): Config {
    switch (action.type) {
        case configActions.SET_GAME_STATE:
            return Object.assign({}, state, {
                state: action.state
            });
        default:
            return state;
    }
}