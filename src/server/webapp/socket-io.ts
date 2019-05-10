import socketIo from "socket.io-client";
import {IOEvent, PlayerDTO} from "../../types";
import * as Actions from './redux/actions';
import store from "./redux/store";

const io: SocketIOClient.Socket = socketIo('localhost:8081');

io.on(IOEvent.PLAYER_ADDED, (player: PlayerDTO) => {
    store.dispatch(Actions.addPlayer(player));
});

export function init() {
    io.emit(IOEvent.I_AM_A_SERVER);
}

export function startGame() {
    io.emit(IOEvent.START_GAME);
}

export default io;