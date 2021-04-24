import {withA11y} from "@storybook/addon-a11y";
import {addDecorator, addParameters} from "@storybook/react";

import withWrapper from "./withWrapper";

addParameters({
    options: {
        showRoots: true,
    },
});
addDecorator(withWrapper);
addDecorator(withA11y);
