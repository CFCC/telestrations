import React from "react";
import {ThemeProvider} from "@material-ui/core/styles";
import Store from "server/webapp/Store";
import {theme} from "utils/theme";
import App from "server/webapp/App";

export default function ServerWebapp() {
    return (<ThemeProvider theme={theme}>
        <Store>
            <App />
        </Store>
    </ThemeProvider>);
}
