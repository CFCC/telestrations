import socketIo from "socket.io-client";
import {Events, IOEvent} from "types/shared";

// const io: SocketIOClient.Socket = socketIo(`localhost:${process.env.REACT_APP_SERVER_PORT}`);
//
// export function attachEvents(events: Events) {
//     Object.entries(events).forEach(([e, f]) => io.on(e, f));
// }
//
// export function init() {
//     io.emit(IOEvent.I_AM_A_SERVER);
// }
//
// export function startGame() {
//     io.emit(IOEvent.START_GAME);
// }