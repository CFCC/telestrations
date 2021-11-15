import { render } from "../utils/render";
import { Standard } from "./TitleScreen.stories";
import React from "react";

it("Renders", () => {
  const { asFragment } = render(Standard());
  expect(asFragment()).toMatchSnapshot();
});
