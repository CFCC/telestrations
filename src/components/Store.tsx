import React, { Context as ContextType, ReactNode, useReducer } from "react";
import _ from "lodash";

// type StoreType<State> = [State, Record<string, (...args: any) => void>];

interface Store {
    reducer: (state: any, action: any) => any;
    initialState: any;
    actionCreators: Record<string, (...args: any) => any>;
    GameContext: ContextType<any>;
}

export interface StoreProps {
    store: Store;
    children: ReactNode;
}

export default function Store(props: StoreProps) {
    const {
        children,
        store: {reducer, initialState, actionCreators, GameContext},
    } = props;

    const [state, dispatch] = useReducer(reducer, initialState);

    type actionCreator = (...args: any) => any;
    type action = (...args: any) => void;
    const actions = _.mapValues(
        actionCreators,
        (creator: actionCreator): action => (...args: any) => dispatch(creator(...args))
    );

    return (
        <GameContext.Provider value={[state, actions]}>
            {children}
        </GameContext.Provider>
    )
}
