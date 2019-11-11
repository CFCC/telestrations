import React from "react";
import * as ReactDOM from "react-dom";
import Client from "./client/App";
import Server from "./server/webapp/App";

const App = window.location.pathname.match(/^\/server/) ? Server : Client;
ReactDOM.render(<App />, document.getElementById("react-app"));
