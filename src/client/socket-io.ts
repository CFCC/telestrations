import socketIo from 'socket.io-client';
import store from './redux/store';
import * as ConfigCreators from './creators/config';
import {GameState} from "../types";

const io: SocketIOClient.Socket = socketIo('localhost:8081');

io.on('start game', () => {
    store.dispatch(ConfigCreators.setGameState(GameState.TYPING));
});

io.on('game already started', () => {
    store.dispatch(ConfigCreators.setGameState(GameState.ALREADY_STARTED));
});

export default io;