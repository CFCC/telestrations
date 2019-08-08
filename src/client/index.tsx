import React from 'react';
import ReactDOM from 'react-dom';
import io from './socket-io';
import App from './App';
import {Provider} from "react-redux";
import store from "./redux/store";
import {IOEvent} from "../types/shared";

ReactDOM.render(<Provider store={store}>
    <App />
</Provider>, document.getElementById('root'));
io.emit(IOEvent.I_AM_A_CLIENT);