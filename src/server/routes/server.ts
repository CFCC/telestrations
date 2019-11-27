import * as game from "../controller";
import {IOEvent} from "../../types/shared";
import {Socket} from "socket.io";
import {getServer, setServer} from "..";

export default (client: Socket) => () => {
    const server = getServer();
    if (server) {
        client.emit(IOEvent.SERVER_ALREADY_CONNECTED);
        client.disconnect(true);
        return;
    } else {
        setServer(client.id);
    }

    client.on(IOEvent.START_GAME, () => {
        client.broadcast.emit(IOEvent.START_GAME);
        game.startGame();
    });

    client.on(IOEvent.DISCONNECT, () => {
        setServer("");
    });
};
