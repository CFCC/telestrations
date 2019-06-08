import {IOEvent} from "../../types";
import * as game from "../controller";
import {Socket} from "socket.io";

let serverWebapp: null | Socket;

export default (client: Socket) => () => {
    if (serverWebapp) return client.disconnect(true);

    serverWebapp = client;

    client.on(IOEvent.START_GAME, () => {
        // @ts-ignore (TODO Get to this)
        io.emit(IOEvent.START_GAME);
        game.startGame();
    });

    client.on(IOEvent.DISCONNECT, () => {
        serverWebapp = null;
    });
};