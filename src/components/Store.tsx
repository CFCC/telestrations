import React, {Context as ContextType, Dispatch, ReactNode, useReducer, useEffect} from "react";
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
    init: (dispatch: Dispatch<any>) => void;
    children: ReactNode;
}

export default function Store({
    children,
    store: {reducer, initialState, actionCreators, GameContext},
    init,
}: StoreProps) {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        init(dispatch);
    }, []);

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
