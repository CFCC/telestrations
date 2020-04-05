import "./init-firebase";

import React from "react";
import * as ReactDOM from "react-dom";
import {StylesProvider, ThemeProvider} from "@material-ui/core/styles";
import styled from "styled-components";

import ClientApp, {init as initClient} from "./client";
import ServerApp, {init as initServer} from "./server";
import * as ClientStore from "./store/client";
import * as ServerStore from "./store/server";
import Store from "./components/Store";
import {darkPrimary, GlobalStyles, primary, theme} from "./utils/theme";

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

const isServer = window.location.pathname.match(/^\/server/);
const App = isServer ? ServerApp : ClientApp;
const store = isServer ? ServerStore : ClientStore;
const init = isServer ? initServer : initClient;

ReactDOM.render((
    <StylesProvider injectFirst={true}>
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <Store store={store} init={init}>
                <Container>
                    <App />
                </Container>
            </Store>
        </ThemeProvider>
    </StylesProvider>
), document.getElementById("root"));
