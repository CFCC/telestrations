import {useState} from "react";

export function useBoolean(initialState: boolean): [boolean, () => void, () => void] {
    const [bool, setBool] = useState(initialState);
    const setBoolTrue = () => setBool(true);
    const setBoolFalse = () => setBool(false);

    return [bool, setBoolTrue, setBoolFalse];
}

export function useEvent<T>(defaultValue: T, getter: (...args: any) => T): [T, (...args: any) => void, (newState: T) => void] {
    const [state, setState] = useState(defaultValue);
    const wrappedSetState = (...args: any) => setState(getter.apply(null, args));

    return [state, wrappedSetState, setState];
}
