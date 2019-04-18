import socketIo from 'socket.io-client';
import store from './redux/store';
import * as Creators from './redux/actions';
import {GameState} from "../types";

const io: SocketIOClient.Socket = socketIo('localhost:8081');

io.on('start game', () => {
    store.dispatch(Creators.setGameState(GameState.TYPING));
});

io.on('game already started', () => {
    store.dispatch(Creators.setGameState(GameState.ALREADY_STARTED));
});

export default io;