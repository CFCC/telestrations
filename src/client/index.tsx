import React from 'react';
import ReactDOM from 'react-dom';
import io from './socket-io';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
io.emit('i am a client');
