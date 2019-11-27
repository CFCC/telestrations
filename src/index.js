import React from "react";
import * as ReactDOM from "react-dom";
import Client from "client";
import Server from "server/webapp";

const App = window.location.pathname.match(/^\/server/) ? Server : Client;
ReactDOM.render(<App />, document.getElementById("root"));
