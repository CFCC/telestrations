import socketIo from 'socket.io-client';
import store from './redux/store';
import * as Creators from './redux/actions';
import {ClientGameState} from "../types";

const io: SocketIOClient.Socket = socketIo('localhost:8081');

io.on('start game', () => {
    store.dispatch(Creators.setGameState(ClientGameState.TYPING));
});

io.on('game already started', () => {
    store.dispatch(Creators.setGameState(ClientGameState.ALREADY_STARTED));
});


export default io;