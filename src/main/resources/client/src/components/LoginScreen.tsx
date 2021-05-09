import React from "react";

import { useSelector } from "../utils/store";
import { useBoolean } from "../utils/hooks";
import TitleScreen from "./TitleScreen";

export default function LoginScreen() {
  const user = useSelector((state) => state.client.user);
  const [uiLoading, , uiShown] = useBoolean(true);

  return <TitleScreen title="Log In" loading={uiLoading} />;
}
