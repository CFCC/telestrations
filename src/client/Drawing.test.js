import {render} from "@testing-library/react";

import {Standard} from "./Drawing.stories";

it('Renders', () => {
    const {asFragment} = render(Standard());
    expect(asFragment()).toMatchSnapshot();
});
