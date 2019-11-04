import React from 'react';
import ReactDOM from 'react-dom';
import io from 'client/socket-io';
import App from 'client/App';
import {Provider} from "react-redux";
import store from "client/redux/store";
import {IOEvent} from "types/shared";

ReactDOM.render(<Provider store={store}>
    <App />
</Provider>, document.getElementById('root'));
io.emit(IOEvent.I_AM_A_CLIENT);
