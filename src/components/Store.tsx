import React, {Context as ContextType, Dispatch, ReactNode, useEffect, useReducer} from "react";
import _ from "lodash";

// type StoreType<State> = [State, Record<string, (...args: any) => void>];

interface Store {
    reducer: (state: any, action: any) => any;
    initialState: any;
    actionCreators: Record<string, (...args: any) => any>;
    GameContext: ContextType<any>;
    init: (dispatch: Dispatch<any>, gameCode: string) => void;
}

export interface StoreProps {
    store: Store;
    children: ReactNode;
}

export default function Store({
    children,
    store: {reducer, initialState, actionCreators, GameContext, init},
}: StoreProps) {
    const [state, dispatch] = useReducer(reducer, initialState);

    type actionCreator = (...args: any) => any;
    type action = (...args: any) => void;
    const actions = _.mapValues(
        actionCreators,
        (creator: actionCreator): action => (...args: any) => dispatch(creator(...args))
    );

    useEffect(() => {
        init(dispatch, state.gameCode);
    }, [init, dispatch, state.gameCode]);

    return (
        <GameContext.Provider value={[state, actions]}>
            {children}
        </GameContext.Provider>
    )
}
