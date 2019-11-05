import React, {createContext, useReducer} from "react";
import {reducer} from "client/redux/reducers";

export const GameContext = createContext(null);

export default function Store({children}) {
    const actions = {

    };

    const [state, dispatch] = useReducer(reducer, {

    });

    const creators = {

    };

    return <GameContext.Provider value={[state, creators]}>
        {children}
    </GameContext.Provider>;
};
