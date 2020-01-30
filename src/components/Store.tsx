import React, { Context as ContextType, ReactNode, useReducer } from "react";
import _ from "lodash";

interface Store<State, Action> {
    reducer: (state: State, action: Action) => State;
    initialState: State;
    actionCreators: Record<string, (...args: any) => Action>;
}

export interface StoreProps<State, Action> {
    context: ContextType<[Partial<Object>, Record<string, (...args: any) => void>]>;
    store: Store<State, Action>;
    children: ReactNode;
}

export default function Store<State, Action>(props: StoreProps<State, Action>) {
    const {
        context: Context,
        children,
        store: {reducer, initialState, actionCreators},
    } = props;

    const [state, dispatch] = useReducer(reducer, initialState);

    type actionCreator = (...args: any) => Action;
    type action = (...args: any) => void;
    const actions = _.mapValues(actionCreators, (creator: actionCreator): action => (...args: any) => dispatch(creator(...args)));

    return (
        <Context.Provider value={[state, actions]}>
            {children}
        </Context.Provider>
    )
}
