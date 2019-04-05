import * as configCreators from '../creators/config';
import * as configActions from '../actions/config';
import {GameState} from "../../types";
import io from '../socket-io';

export interface Config {
    nicknameSubmitted: boolean;
    state: GameState;
    nickname: string;
}

const defaultState: Config = {
    nicknameSubmitted: false,
    state: GameState.LOADING,
    nickname: ''
};

export default function configReducer(state: Config = defaultState, action: configCreators.ConfigCreator): Config {
    switch (action.type) {
        case configActions.SET_GAME_STATE:
            return Object.assign({}, state, {
                state: action.state
            });
        case configActions.SET_NICKNAME:
            return Object.assign({}, state, {
                nickname: action.nickname
            });
        case configActions.SUBMIT_NICKNAME:
            io.emit('submit nick', state.nickname);
            return Object.assign({}, state, {
                nicknameSubmitted: true
            });
        default:
            return state;
    }
}