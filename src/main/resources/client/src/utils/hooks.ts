import { FormEvent, useState } from "react";

import { useSelector } from "./store";

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

export default function useInput<T extends string>(
  defaultValue: T
): [T, (e: FormEvent<HTMLInputElement> | T) => void] {
  const [state, setState] = useState(defaultValue);

  function onChange(e: FormEvent<HTMLInputElement> | T) {
    if (typeof e === "object") {
      setState(e.currentTarget.value as T);
    } else {
      setState(e);
    }
  }

  return [state, onChange];
}
