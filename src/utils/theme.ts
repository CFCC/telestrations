import {createMuiTheme} from "@material-ui/core/styles";
import {createGlobalStyle} from "styled-components";

export const primary = "hsl(50, 100%, 65%)";
export const darkPrimary = "hsl(40, 100%, 45%)";
export const secondary = "hsl(210, 100%, 33%)";

function headers(styles: object): object {
    return {
        h1: styles,
        h2: styles,
        h3: styles,
        h4: styles,
        h5: styles,
        h6: styles,
    };
}

function body(styles: object): object {
    return {
        subtitle1: styles,
        subtitle2: styles,
        body1: styles,
        body2: styles,
        button: styles,
        caption: styles,
        overline: styles,
    }
}

export const theme = createMuiTheme({
    typography: {
        ...body({fontFamily: "Fira Sans"}),
        ...headers({fontFamily: "Mali"}),
    },
});

export const GlobalStyles = createGlobalStyle`
    body {
        margin: 0;
        overflow: hidden;
    }
`;
