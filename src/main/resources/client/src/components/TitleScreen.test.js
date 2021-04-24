import {render} from "../utils/render";
import {Standard} from "./TitleScreen.stories";

it('Renders', () => {
    const {asFragment} = render(Standard());
    expect(asFragment()).toMatchSnapshot();
});
import React from "react";

