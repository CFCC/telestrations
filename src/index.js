import 'init-firebase'

import React from "react";
import * as ReactDOM from "react-dom";
import {StylesProvider, ThemeProvider} from "@material-ui/core/styles";
import styled from "styled-components";

import ClientApp from "client";
import ServerApp from "server";
import {GameContext as ClientStore} from "store/client";
import {GameContext as ServerStore} from "store/server";
import Store from "components/Store";
import {darkPrimary, GlobalStyles, primary, theme} from "utils/theme";

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

const App = window.location.pathname.match(/^\/server/) ? ServerApp : ClientApp;
const store = window.location.pathname.match(/^\/server/) ? ServerStore : ClientStore;

ReactDOM.render(<StylesProvider injectFirst={true}>
    <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Store context={store.context} store={store}>
            <Container>
                <App />
            </Container>
        </Store>
    </ThemeProvider>
</StylesProvider>, document.getElementById("root"));
