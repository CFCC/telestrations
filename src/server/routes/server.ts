import * as game from "../controller";
import {RoutesConfig} from "../../types/server";
import {IOEvent} from "../../types/shared";

export default ({setServer, client, io, serverWebapp}: RoutesConfig) => () => {
    if (serverWebapp) {
        client.emit(IOEvent.SERVER_ALREADY_CONNECTED);
        client.disconnect(true);
        return;
    } else {
        setServer(client);

    }

    client.on(IOEvent.START_GAME, () => {
        io.emit(IOEvent.START_GAME);
        game.startGame();
    });

    client.on(IOEvent.DISCONNECT, () => {
        setServer(null);
    });
};
