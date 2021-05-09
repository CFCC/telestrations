import React from "react";
import * as ReactDOM from "react-dom";
import { StylesProvider, ThemeProvider } from "@material-ui/core/styles";
import styled from "styled-components";
import { Provider } from "react-redux";

import ClientApp from "./client";
import ServerApp from "./server";
import { darkPrimary, GlobalStyles, primary, theme } from "./utils/theme";
import { store } from "./utils/store";
import Toast from "./components/Toast";

const Container = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, ${primary} 50%, ${darkPrimary} 100%);
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
      <Toast />
      <Provider store={store}>
        <Container>
          <App />
        </Container>
      </Provider>
    </ThemeProvider>
  </StylesProvider>,
  document.getElementById("root")
);
