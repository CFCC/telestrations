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

export function useArray<T>(initialValue: T[]): [T[], (t: T) => void, (oldIndex: number, newT: T) => void, (index: number) => void] {
    const [array, setArray] = useState(initialValue);

    function add(t: T) {
        const copy = [...array];
        copy.push(t);
        setArray(copy);
    }

    function edit(oldIndex: number, newT: T) {
        const copy = [...array];
        copy.splice(oldIndex, 1, newT);
        setArray(copy);
    }

    function remove(index: number) {
        const copy = [...array];
        copy.splice(index, 1);
        setArray(copy);
    }

    return [array, add, edit, remove];
}
