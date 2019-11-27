import React from "react";
import {ThemeProvider} from "@material-ui/core/styles";
import Store from "client/Store";
import {theme} from "utils/theme";
import App from "client/App";

export default function Client() {
    return (<ThemeProvider theme={theme}>
        <Store>
            <App />
        </Store>
    </ThemeProvider>);
}
