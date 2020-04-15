const {addDecorator} = require("@storybook/react");
const {withA11y} = require("@storybook/addon-a11y");

const withWrapper = require('./withWrapper').default;

addDecorator(withWrapper);
addDecorator(withA11y);
