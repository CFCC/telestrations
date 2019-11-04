import * as game from "server/controller";
import {RoutesConfig} from "types/server";
import {IOEvent} from "types/shared";

export default (config: RoutesConfig) => () => {
    const {setServer, client, io, serverWebapp} = config;

    if (serverWebapp) return config.client.disconnect(true);
    setServer(client);

    client.on(IOEvent.START_GAME, () => {
        io.emit(IOEvent.START_GAME);
        game.startGame();
    });

    client.on(IOEvent.DISCONNECT, () => {
        setServer(null);
    });
};
