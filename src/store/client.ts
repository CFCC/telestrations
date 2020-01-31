import { createContext } from "react";

import { State, Action, ActionTypes, Actions, Store } from "store/client.types";
import { ClientGameState } from "types/client";
import { NewContentDTO } from "types/server";
import { ContentType } from "types/shared";
import { joinGame } from "firebase-client/client";

export const initialState: State = {
    user: null,
    gameCode: "",
    gameState: ClientGameState.LOGIN,
    guess: "",
    content: "",
};

export function reducer(state: State, action: Action): State {
    switch (action.type) {
        case ActionTypes.SET_USER:
            return {...state, user: action.user, gameState: ClientGameState.GAME_SELECTION};
        case ActionTypes.JOIN_GAME:
            joinGame(state.user, action.gameCode);
            return {...state, gameState: ClientGameState.WAITING_TO_START};
        case ActionTypes.SET_GUESS:
            // updateGuess(action.guess);
            return {...state, guess: action.guess};
        case ActionTypes.SUBMIT_GUESS:
            // finishTurn();
            return state;
        case ActionTypes.NEW_CONTENT:
            return {
                ...state,
                gameState: action.content.type === ContentType.Text ? ClientGameState.DRAWING : ClientGameState.TYPING,
                content: action.content.content,
                guess: "",
            };
        case ActionTypes.INIT:
            // init();
            return state;
        default:
            return state;
    }
}

export const actionCreators: Actions = {
    setUser: (user: firebase.User | null) => ({type: ActionTypes.SET_USER, user}),
    newContent: (content: NewContentDTO) => ({type: ActionTypes.NEW_CONTENT, content}),
    joinGame: (gameCode: string) => ({type: ActionTypes.JOIN_GAME, gameCode}),
    setGuess: (guess: string) => ({type: ActionTypes.SET_GUESS, guess}),
    submitGuess: () => ({type: ActionTypes.SUBMIT_GUESS}),
    init: () => ({type: ActionTypes.INIT}),
};

export const GameContext = createContext([initialState, actionCreators] as Store);