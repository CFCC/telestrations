import * as configCreators from '../creators/config';
import * as configActions from '../actions/config';
import {GameState} from "../../../custom-types";

export interface Config {
    ip: String,
    state: GameState
}

const defaultState: Config = {
    ip: '',
    state: 'loading'
};

export default function configReducer(state: Config = defaultState, action: configCreators.ConfigCreator): Config {
    switch (action.type) {
        case configActions.SET_IP:
            return Object.assign({}, state, {
                ip: action.ip
            });
        case configActions.SET_GAME_STATE:
            return Object.assign({}, state, {
                state: action.state
            });
        default:
            return state;
    }
}