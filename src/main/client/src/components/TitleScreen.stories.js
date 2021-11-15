import React from "react";
import { text } from "@storybook/addon-knobs";
import Typography from "@material-ui/core/Typography";

import TitleScreen from "./TitleScreen";

export default {
  title: "Common/Title Screen",
  component: TitleScreen,
};

export const Standard = () => (
  <TitleScreen
    title={text("Title", "Hello, world!")}
    subtitle={text("Subtitle", "How are you?")}
  />
);

export const Loading = () => (
  <TitleScreen
    title={text("Title", "Hello, world!")}
    subtitle={text("Subtitle", "How are you?")}
    loading={true}
  />
);

export const WithChildren = () => (
  <TitleScreen
    title={text("Title", "Hello, world!")}
    subtitle={text("Subtitle", "How are you?")}
  >
    <Typography style={{ marginTop: "2rem" }}>Example child content</Typography>
  </TitleScreen>
);
