import socketIo from 'socket.io-client';
import store from './redux/store';
import * as Creators from './redux/actions';
import {NewContentDTO} from "../types/server";
import {ClientGameState} from "../types/client";
import {IOEvent} from "../types/shared";

const io: SocketIOClient.Socket = socketIo('localhost:8081');

io.on(IOEvent.START_GAME, () => {
    store.dispatch(Creators.setGameState(ClientGameState.TYPING));
});

io.on(IOEvent.GAME_ALREADY_STARTED, () => {
    store.dispatch(Creators.setGameState(ClientGameState.ALREADY_STARTED));
});

io.on(IOEvent.WAIT, () => {
    store.dispatch(Creators.setGameState(ClientGameState.WAITING));
});

io.on(IOEvent.NEW_CONTENT, (content: NewContentDTO) => {
    store.dispatch(Creators.newContent(content));
});

io.on(IOEvent.NO_MORE_CONTENT, () => {
    store.dispatch(Creators.setGameState(ClientGameState.FINISHED));
});

export function submitNick(nick: string) {
    io.emit(IOEvent.SUBMIT_NICK, nick);
}

export function updateGuess(content: string) {
    io.emit(IOEvent.UPDATE_GUESS, content);
}

export function finishTurn() {
    io.emit(IOEvent.FINISHED_GAME_TURN);
}

export default io;