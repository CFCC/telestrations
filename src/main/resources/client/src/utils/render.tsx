import React from "react";
import { render } from "@testing-library/react";
import { StylesProvider, ThemeProvider } from "@material-ui/core/styles";
import { Provider } from "react-redux";

import { GlobalStyles, theme } from "./theme";
import { store } from "./store";

interface WrapperProps {
  children: React.ReactNode;
}

const wrapper = ({ children }: WrapperProps) => (
  <React.Fragment>
    <StylesProvider injectFirst={true}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Provider store={store}>{children}</Provider>
      </ThemeProvider>
    </StylesProvider>
  </React.Fragment>
);
const customRender = (ui: React.ReactElement) =>
  render(ui, { wrapper } as object);

export { customRender as render };
