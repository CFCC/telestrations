import React from "react";
import ReactDOM from "react-dom";
import io from "client/socket-io";
import App from "client/App";
import {IOEvent} from "types/shared";

ReactDOM.render(<App />, document.getElementById("root"));
io.emit(IOEvent.I_AM_A_CLIENT);
