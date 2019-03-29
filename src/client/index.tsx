import React from 'react';
import ReactDOM from 'react-dom';
import io from './socket-io';
import App from './App';
import {Provider} from "react-redux";
import store from "./store";

ReactDOM.render(<Provider store={store}>
    <App />
</Provider>, document.getElementById('root'));
io.emit('i am a client');