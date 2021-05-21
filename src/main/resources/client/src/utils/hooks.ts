import { useState } from "react";

export function useBoolean(
  initialState: boolean
): [boolean, () => void, () => void] {
  const [bool, setBool] = useState(initialState);
  const setBoolTrue = () => setBool(true);
  const setBoolFalse = () => setBool(false);

  return [bool, setBoolTrue, setBoolFalse];
}

export function useEvent<T>(
  defaultValue: T,
  getter: (...args: any) => T
): [T, (...args: any) => void, (newState: T) => void] {
  const [state, setState] = useState(defaultValue);
  const wrappedSetState = (...args: any) => setState(getter.apply(null, args));

  return [state, wrappedSetState, setState];
}

type Event = {
  target: { value: string };
  currentTarget: { value: string };
};
export function useInput<T extends string, U extends Event>(
  defaultValue: T
): [T, (e: object | T) => void, () => void] {
  const [state, setState] = useState(defaultValue);

  function onChange(e: object | T) {
    if (typeof e === "object") {
      const target = (e as U).target || (e as U).currentTarget;
      setState(target.value as T);
    } else {
      setState(e);
    }
  }

  function resetInput() {
    setState(defaultValue);
  }

  return [state, onChange, resetInput];
}
