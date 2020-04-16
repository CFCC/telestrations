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
    webpackFinal: config => ({
        ...config,
        node: {
            ...config.node,
            child_process: "empty",
            fs: "empty",
            crypto: "empty",
            net: "empty",
            tls: "empty"
        },
    }),
};
