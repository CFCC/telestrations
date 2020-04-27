const path = require("path");
const _ = require("lodash");

module.exports = {
    stories: ["../src/**/*.stories.js"],
    addons: [
        "@storybook/preset-create-react-app",
        "@storybook/addon-actions",
        "@storybook/addon-knobs",
        "@storybook/addon-storysource",
        "@storybook/addon-a11y",
        "@storybook/addon-viewport",
    ],
    webpackFinal: config => _.merge(config, {
        node: {
            child_process: "empty",
            fs: "empty",
            crypto: "empty",
            net: "empty",
            tls: "empty"
        },
        resolve: {
            alias: {
                "firebaseui/dist/firebaseui.css$": path.resolve(__dirname, "..", "src", "__mocks__", "firebaseui.js"),
                "firebaseui$": path.resolve(__dirname, "..", "src", "__mocks__", "firebaseui.js"),
                "./firebase$": path.resolve(__dirname, "..", "src", "utils", "__mocks__", "firebase.js"),
                "../utils/firebase$": path.resolve(__dirname, "..", "src", "utils", "__mocks__", "firebase.js"),
            },
        },
    }),
};
