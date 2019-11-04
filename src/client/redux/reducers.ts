import * as Actions from "client/redux/actions";
import {submitNick, finishTurn, updateGuess} from "client/socket-io";
import {ContentType} from "types/shared";
import {ClientGameState} from "types/client";

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
    nickname: "",
    guess: "",
    content: ""
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
            updateGuess(action.guess);
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
                guess: ""
            });
        default:
            return state;
    }
}
