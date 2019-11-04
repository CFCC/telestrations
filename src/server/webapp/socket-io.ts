import socketIo from "socket.io-client";
import * as Actions from "server/webapp/redux/actions";
import store from "server/webapp/redux/store";
import {FinishedGameTurnDTO, NotepadPageDTO, PlayerDTO} from "types/server";
import {IOEvent} from "types/shared";

const io: SocketIOClient.Socket = socketIo("localhost:8081");

io.on(IOEvent.PLAYER_ADDED, (player: PlayerDTO) => {
    store.dispatch(Actions.addPlayer(player));
});

io.on(IOEvent.UPDATE_GUESS, (content: NotepadPageDTO) => {
    store.dispatch(Actions.updateGuess(content.playerId, content.content));
});

io.on(IOEvent.FINISHED_GAME_TURN, (content: FinishedGameTurnDTO) => {
    store.dispatch(Actions.finishedGameTurn(content.playerId, content.newNotepadOwnerId));
});

io.on(IOEvent.GAME_FINISHED, () => {
    store.dispatch(Actions.gameFinished());
});

export function init() {
    io.emit(IOEvent.I_AM_A_SERVER);
}

export function startGame() {
    io.emit(IOEvent.START_GAME);
}

export default io;
