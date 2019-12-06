import React from "react";
import * as ReactDOM from "react-dom";
import ClientApp from "client";
import ServerApp from "server/webapp";
import ClientStore from "client/Store";
import ServerStore from "server/webapp/Store";
import styled from "styled-components";
import {darkPrimary, GlobalStyles, primary, theme} from "utils/theme";
import {StylesProvider, ThemeProvider} from "@material-ui/core/styles";

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
const Store = window.location.pathname.match(/^\/server/) ? ServerStore : ClientStore;
ReactDOM.render(<StylesProvider injectFirst={true}>
    <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Store>
            <Container>
                <App />
            </Container>
        </Store>
    </ThemeProvider>
</StylesProvider>, document.getElementById("root"));
