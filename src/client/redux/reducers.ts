import * as Actions from './actions';
import {GameState} from "../../types";
import io from '../socket-io';

export interface State {
    nicknameSubmitted: boolean;
    state: GameState;
    nickname: string;
    guess: string;
}

const defaultState: State = {
    nicknameSubmitted: false,
    state: GameState.LOADING,
    nickname: '',
    guess: ''
};

export default function reducer(state: State = defaultState, action: Actions.Creator): State {
    switch (action.type) {
        case Actions.SET_GAME_STATE:
            return Object.assign({}, state, {
                state: action.state
            });
        case Actions.SET_NICKNAME:
            return Object.assign({}, state, {
                nickname: action.nickname
            });
        case Actions.SUBMIT_NICKNAME:
            io.emit('submit nick', state.nickname);
            return Object.assign({}, state, {
                nicknameSubmitted: true
            });
        case Actions.FINISH_TURN:
            return Object.assign({}, state, {

            });
        case Actions.SET_GUESS:
            return Object.assign({}, state, {
                guess: action.guess
            });
        case Actions.SUBMIT_GUESS:
            return Object.assign({}, state, {

            });
        default:
            return state;
    }
}