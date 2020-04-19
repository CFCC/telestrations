import {StylesProvider, ThemeProvider} from "@material-ui/core/styles";
import {Provider} from "react-redux";
import React from "react";
import styled from "styled-components";
import {configureStore} from "@reduxjs/toolkit";
import {action} from "@storybook/addon-actions";

import {darkPrimary, GlobalStyles, primary, theme} from "../src/utils/theme";
import {defaultState} from "../src/utils/store";

const Container = styled.div`
    position: absolute;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(180deg, ${primary} 50%, ${darkPrimary} 100%);
    margin: 0;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    align-items: center;
    flex-direction: column;
`;

const reducer = (state, dispatchedAction) => {
    if (action.payload) {
        action("Redux Action Dispatched")(dispatchedAction.type, dispatchedAction.payload);
    } else {
        action("Redux Action Dispatched")(dispatchedAction.type);
    }

    return defaultState;
}
const store = configureStore({reducer})

export default storyCallback => (
    <StylesProvider injectFirst={true}>
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <Provider store={store}>
                <Container>
                    {storyCallback()}
                </Container>
            </Provider>
        </ThemeProvider>
    </StylesProvider>
);

