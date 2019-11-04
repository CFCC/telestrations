import socketIo, {Socket} from 'socket.io';
import http from 'http';
import {serverEvents, clientEvents} from 'server/routes';
import {RoutesConfig} from "types/server";
import {IOEvent} from "types/shared";

const server = http.createServer();
const io = socketIo(server);
let serverWebapp: null | Socket;

const setServer = (s: null | Socket) => {
    serverWebapp = s;
};

io.on(IOEvent.NEW_CLIENT, client => {
    const config: RoutesConfig = {io, client, serverWebapp, setServer};

    client.on(IOEvent.I_AM_A_SERVER, serverEvents(config));
    client.on(IOEvent.I_AM_A_CLIENT, clientEvents(config));
});

server.listen(8081);
