import React from "react";
import {ThemeProvider} from "@material-ui/core/styles";
import Store from "server/webapp/Store";
import {theme, globalStyles} from "utils/theme";
import App from "server/webapp/App";

export default function ServerWebapp() {
    globalStyles();

    return (<ThemeProvider theme={theme}>
        <Store>
            <App />
        </Store>
    </ThemeProvider>);
}
