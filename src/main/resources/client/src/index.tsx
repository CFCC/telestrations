import React from "react";
import * as ReactDOM from "react-dom";
import { StylesProvider, ThemeProvider } from "@material-ui/core/styles";
import styled from "styled-components";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";

import ClientApp from "./client";
import ServerApp from "./server";
import { darkPrimary, GlobalStyles, primary, theme } from "./utils/theme";
import { store } from "./utils/store";
import Toast from "./components/Toast";

const Container = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
    to right,
    ${darkPrimary} 0%,
    ${primary} 33%,
    ${primary} 66%,
    ${darkPrimary} 100%
  );
  margin: 0;
  overflow-y: auto;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const isServer = window.location.pathname.match(/^\/server/);
const App = isServer ? ServerApp : ClientApp;

ReactDOM.render(
  <StylesProvider injectFirst={true}>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Provider store={store}>
        <SnackbarProvider>
          <Toast />
          <Container>
            <App />
          </Container>
        </SnackbarProvider>
      </Provider>
    </ThemeProvider>
  </StylesProvider>,
  document.getElementById("root")
);
