import socketIo from 'socket.io';
import http from 'http';
import {serverEvents, clientEvents} from './routes';
import {IOEvent} from "../types";

const server = http.createServer();
const io = socketIo(server);

io.on(IOEvent.NEW_CLIENT, client => {
    const config = {io, client};

    client.on(IOEvent.I_AM_A_SERVER, serverEvents(client));
    client.on(IOEvent.I_AM_A_CLIENT, clientEvents(client));
});

server.listen(8081);