import React from "react";
import {ThemeProvider} from "@material-ui/core/styles";
import Store from "client/Store";
import {GlobalStyles, theme} from "utils/theme";
import App from "client/App";

export default function Client() {
    return (<ThemeProvider theme={theme}>
        <GlobalStyles />
        <Store>
            <App />
        </Store>
    </ThemeProvider>);
}
