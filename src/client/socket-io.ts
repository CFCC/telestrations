import socketIo from 'socket.io-client';
import store from './redux/store';
import * as Creators from './redux/actions';
import {ClientGameState, IOEvent} from "../types";

const io: SocketIOClient.Socket = socketIo('localhost:8081');

io.on(IOEvent.START_GAME, () => {
    store.dispatch(Creators.setGameState(ClientGameState.TYPING));
});

io.on(IOEvent.GAME_ALREADY_STARTED, () => {
    store.dispatch(Creators.setGameState(ClientGameState.ALREADY_STARTED));
});


export default io;