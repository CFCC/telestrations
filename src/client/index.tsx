import React from "react";
import ReactDOM from "react-dom";
import {init} from "./socket-io";
import App from "./App";

ReactDOM.render(<App />, document.getElementById("root"));
init();
