import socketIo from "socket.io-client";
import {Events, IOEvent} from "../types/shared";

const io: SocketIOClient.Socket = socketIo("localhost:8081");

export function attachEvents(events: Events) {
    Object.entries(events).forEach(([e, f]) => io.on(e, f));
}

export function submitNick(nick: string) {
    io.emit(IOEvent.SUBMIT_NICK, nick);
}

export function updateGuess(content: string) {
    io.emit(IOEvent.UPDATE_GUESS, content);
}

export function finishTurn() {
    io.emit(IOEvent.FINISHED_GAME_TURN);
}

export function init() {
    io.emit(IOEvent.I_AM_A_CLIENT);
}
