import socketIo from 'socket.io-client';
import store from './store';
import * as ConfigCreators from './creators/config';

const io: SocketIOClient.Socket = socketIo('localhost:8081');

io.on('start game', () => {
    store.dispatch(ConfigCreators.setGameState('typing'));
});

io.on('game already started', () => {
    store.dispatch(ConfigCreators.setGameState('already started'));
})

export default io;