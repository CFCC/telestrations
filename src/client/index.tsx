import React from "react";
import {ThemeProvider} from "@material-ui/core/styles";
import Store from "client/Store";
import {globalStyles, theme} from "utils/theme";
import App from "client/App";

export default function Client() {
    globalStyles();

    return (<ThemeProvider theme={theme}>
        <Store>
            <App />
        </Store>
    </ThemeProvider>);
}
