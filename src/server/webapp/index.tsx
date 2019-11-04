import React from 'react';
import ReactDOM from 'react-dom';
import App from 'server/webapp/App';
import {Provider} from "react-redux";
import store from "server/webapp/redux/store";

ReactDOM.render(<Provider store={store}>
    <App />
</Provider>, document.getElementById('root'));
