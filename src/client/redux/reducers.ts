import {Creator, Action} from './actions';
import {GameState} from "../../types";
import io from '../socket-io';

export interface State {
    nicknameSubmitted: boolean;
    state: GameState;
    nickname: string;
}

const defaultState: State = {
    nicknameSubmitted: false,
    state: GameState.LOADING,
    nickname: ''
};

export default function reducer(state: State = defaultState, action: Creator): State {
    switch (action.type) {
        case Action.SET_GAME_STATE:
            return Object.assign({}, state, {
                state: action.state
            });
        case Action.SET_NICKNAME:
            return Object.assign({}, state, {
                nickname: action.nickname
            });
        case Action.SUBMIT_NICKNAME:
            io.emit('submit nick', state.nickname);
            return Object.assign({}, state, {
                nicknameSubmitted: true
            });
        case Action.FINISH_TURN:
            return Object.assign({}, state, {

            });
        default:
            return state;
    }
}