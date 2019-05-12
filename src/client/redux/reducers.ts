import * as Actions from './actions';
import {ClientGameState, ContentType} from "../../types";
import {submitNick, finishTurn} from '../socket-io';

export interface State {
    nicknameSubmitted: boolean;
    state: ClientGameState;
    nickname: string;
    guess: string;
    content: string;
}

const defaultState: State = {
    nicknameSubmitted: false,
    state: ClientGameState.LOADING,
    nickname: '',
    guess: '',
    content: ''
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
            submitNick(state.nickname);
            return Object.assign({}, state, {
                nicknameSubmitted: true
            });
        case Actions.SET_GUESS:
            return Object.assign({}, state, {
                guess: action.guess
            });
        case Actions.SUBMIT_GUESS:
            finishTurn();
            return state;
        case Actions.NEW_CONTENT:
            return Object.assign({}, state, {
                state: action.content.type === ContentType.Text ? ClientGameState.DRAWING : ClientGameState.TYPING,
                content: action.content.content,
                guess: ''
            });
        default:
            return state;
    }
}