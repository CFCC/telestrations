import React, {createContext, ReactNode, useEffect, useReducer} from "react";
import firebase from "firebase/app";

import {ClientGameState} from "types/client";
import {ContentType, IOEvent} from "types/shared";
import {NewContentDTO} from "types/server";
import {attachEvents, setGuess} from "client/firebase";

// region [Types]

interface State {
    user: firebase.User | null;
    gameCode: string;
    pictureId: string;
    state: ClientGameState;
    guess: string;
    content: string;
}

interface StoreProps {
    children: ReactNode;
}

enum ActionTypes {
    SET_USER = "SET_USER",
    NEW_CONTENT = "NEW_CONTENT",
    SET_GAME_STATE = "SET_GAME_STATE",
    SET_GUESS = "SET_GUESS",
    SUBMIT_GUESS = "SUBMIT_GUESS",
}

interface setUser {
    type: ActionTypes.SET_USER;
    user: firebase.User | null;
}

interface newContent {
    type: ActionTypes.NEW_CONTENT;
    content: NewContentDTO
}

interface setGameState {
    type: ActionTypes.SET_GAME_STATE;
    state: ClientGameState;
}

interface setGuess {
    type: ActionTypes.SET_GUESS;
    guess: string;
}

interface submitGuess {
    type: ActionTypes.SUBMIT_GUESS;
}

type Action = setUser | setGameState | setGuess | submitGuess | newContent;

interface Actions {
    setUser: (user: firebase.User | null) => void,
    newContent: (content: NewContentDTO) => void,
    setGameState: (state: ClientGameState) => void,
    setGuess: (guess: string) => void,
    submitGuess: () => void,
}

type Store = [State, Actions];

// endregion

const actionStubs = {
    setUser: () => null,
    newContent: () => null,
    setGameState: () => null,
    setGuess: () => null,
    submitGuess: () => null,
};

const defaultState: State = {
    user: null,
    gameCode: "",
    pictureId: "",
    state: ClientGameState.LOGIN,
    guess: "",
    content: "",
};

export const GameContext = createContext([defaultState, actionStubs] as Store);

function reducer(state: State = defaultState, action: Action): State {
    switch (action.type) {
        case ActionTypes.SET_USER:
            return {...state, user: action.user};
        case ActionTypes.SET_GAME_STATE:
            return {...state, state: action.state};
        case ActionTypes.SET_GUESS: {
            if (!state.user) return {...state, guess: action.guess};

            const pictureId = setGuess(
                state.user,
                action.guess,
                state.gameCode,
                action.guess.startsWith("data:image/png;base64,") ? state.pictureId : undefined
            );

            return {...state, guess: action.guess, pictureId: pictureId || ""};
        }
        case ActionTypes.SUBMIT_GUESS:
            // finishTurn();
            return state;
        case ActionTypes.NEW_CONTENT:
            return {
                ...state,
                state: action.content.type === ContentType.Text ? ClientGameState.DRAWING : ClientGameState.TYPING,
                content: action.content.content,
                guess: "",
            };
        default:
            return state;
    }
}

export default function Store({children}: StoreProps) {
    const [state, dispatch] = useReducer(reducer, defaultState);
    const actions = {
        setUser: (user: firebase.User | null) => dispatch({type: ActionTypes.SET_USER, user}),
        newContent: (content: NewContentDTO) => dispatch({type: ActionTypes.NEW_CONTENT, content}),
        setGameState: (cgs: ClientGameState) => dispatch({type: ActionTypes.SET_GAME_STATE, state: cgs}),
        setGuess: (guess: string) => dispatch({type: ActionTypes.SET_GUESS, guess}),
        submitGuess: () => dispatch({type: ActionTypes.SUBMIT_GUESS}),
    };

    useEffect(() => {
        attachEvents({
            [IOEvent.START_GAME]: () => actions.setGameState(ClientGameState.TYPING),
            [IOEvent.GAME_ALREADY_STARTED]: () => actions.setGameState(ClientGameState.ALREADY_STARTED),
            [IOEvent.WAIT]: () => actions.setGameState(ClientGameState.WAITING_FOR_CONTENT),
            [IOEvent.NEW_CONTENT]: actions.newContent,
            [IOEvent.NO_MORE_CONTENT]: () => actions.setGameState(ClientGameState.FINISHED),
        });
    }, []);

    return (<GameContext.Provider value={[state, actions]}>
        {children}
    </GameContext.Provider>);
};
