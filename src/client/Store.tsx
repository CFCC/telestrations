import React, {createContext, ReactNode, useEffect, useReducer} from "react";
import {ClientGameState} from "types/client";
import {finishTurn, submitNick, updateGuess, attachEvents, init} from "client/socket-io";
import {ContentType, IOEvent} from "types/shared";
import {NewContentDTO} from "types/server";

// region [Types]

interface State {
    nicknameSubmitted: boolean;
    state: ClientGameState;
    nickname: string;
    guess: string;
    content: string;
}

interface StoreProps {
    children: ReactNode;
}

enum ActionTypes {
    NEW_CONTENT = "NEW_CONTENT",
    SET_GAME_STATE = "SET_GAME_STATE",
    SET_NICKNAME = "SET_NICKNAME",
    SUBMIT_NICKNAME = "SUBMIT_NICKNAME",
    SET_GUESS = "SET_GUESS",
    SUBMIT_GUESS = "SUBMIT_GUESS",
    INIT = "INIT",
}

interface newContent {
    type: ActionTypes.NEW_CONTENT;
    content: NewContentDTO
}

interface setGameState {
    type: ActionTypes.SET_GAME_STATE;
    state: ClientGameState;
}

interface setNickname {
    type: ActionTypes.SET_NICKNAME;
    nickname: String;
}

interface submitNickname {
    type: ActionTypes.SUBMIT_NICKNAME;
}

interface setGuess {
    type: ActionTypes.SET_GUESS;
    guess: string;
}

interface submitGuess {
    type: ActionTypes.SUBMIT_GUESS;
}

interface init {
    type: ActionTypes.INIT;
}

type Action = setGameState | setNickname | submitNickname | setGuess | submitGuess | newContent | init;

interface Actions {
    newContent: (content: NewContentDTO) => void,
    setGameState: (state: ClientGameState) => void,
    setNickname: (nickname: String) => void,
    submitNickname: () => void,
    setGuess: (guess: string) => void,
    submitGuess: () => void,
    init: () => void,
}

type Store = [State, Actions];

// endregion

const actionStubs = {
    newContent: () => null,
    setGameState: () => null,
    setNickname: () => null,
    submitNickname: () => null,
    setGuess: () => null,
    submitGuess: () => null,
    init: () => null,
};

const defaultState: State = {
    nicknameSubmitted: false,
    state: ClientGameState.WAITING,
    nickname: "",
    guess: "",
    content: "",
};

export const GameContext = createContext([defaultState, actionStubs] as Store);

function reducer(state: State = defaultState, action: Action): State {
    switch (action.type) {
        case ActionTypes.SET_GAME_STATE:
            return Object.assign({}, state, {
                state: action.state,
            });
        case ActionTypes.SET_NICKNAME:
            return Object.assign({}, state, {
                nickname: action.nickname,
            });
        case ActionTypes.SUBMIT_NICKNAME:
            submitNick(state.nickname);
            return Object.assign({}, state, {
                nicknameSubmitted: true,
            });
        case ActionTypes.SET_GUESS:
            updateGuess(action.guess);
            return Object.assign({}, state, {
                guess: action.guess,
            });
        case ActionTypes.SUBMIT_GUESS:
            finishTurn();
            return state;
        case ActionTypes.NEW_CONTENT:
            return Object.assign({}, state, {
                state: action.content.type === ContentType.Text ? ClientGameState.DRAWING : ClientGameState.TYPING,
                content: action.content.content,
                guess: "",
            });
        case ActionTypes.INIT:
            init();
            return state;
        default:
            return state;
    }
}

export default function Store({children}: StoreProps) {
    const [state, dispatch] = useReducer(reducer, defaultState);
    const actions = {
        newContent: (content: NewContentDTO) => dispatch({
            type: ActionTypes.NEW_CONTENT,
            content,
        }),
        setGameState: (cgs: ClientGameState) => dispatch({
            type: ActionTypes.SET_GAME_STATE,
            state: cgs,
        }),
        setNickname: (nickname: String) => dispatch({
            type: ActionTypes.SET_NICKNAME,
            nickname,
        }),
        submitNickname: () => dispatch({
            type: ActionTypes.SUBMIT_NICKNAME,
        }),
        setGuess: (guess: string) => dispatch({
            type: ActionTypes.SET_GUESS,
            guess,
        }),
        submitGuess: () => dispatch({
            type: ActionTypes.SUBMIT_GUESS,
        }),
        init: () => dispatch({
            type: ActionTypes.INIT,
        }),
    };

    useEffect(() => {
        attachEvents({
            [IOEvent.START_GAME]: () => actions.setGameState(ClientGameState.TYPING),
            [IOEvent.GAME_ALREADY_STARTED]: () => actions.setGameState(ClientGameState.ALREADY_STARTED),
            [IOEvent.WAIT]: () => actions.setGameState(ClientGameState.WAITING),
            [IOEvent.NEW_CONTENT]: actions.newContent,
            [IOEvent.NO_MORE_CONTENT]: () => actions.setGameState(ClientGameState.FINISHED),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (<GameContext.Provider value={[state, actions]}>
        {children}
    </GameContext.Provider>);
};
