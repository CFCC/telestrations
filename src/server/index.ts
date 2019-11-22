import {Socket} from "socket.io";
import * as socketIo from "socket.io";
import * as http from "http";
import * as dotenv from "dotenv";
import {serverEvents, clientEvents} from "./routes";
import {RoutesConfig} from "../types/server";
import {IOEvent} from "../types/shared";

dotenv.config();
const server = http.createServer();
const io = socketIo.listen(server);
let serverWebapp: Socket | null;

const setServer = (s: Socket | null) => {
    serverWebapp = s;
};

io.on(IOEvent.NEW_CLIENT, client => {
    const config: RoutesConfig = {io, client, serverWebapp, setServer};

    client.on(IOEvent.I_AM_A_SERVER, serverEvents(config));
    client.on(IOEvent.I_AM_A_CLIENT, clientEvents(config));
});

server.listen(process.env.REACT_APP_SERVER_PORT);
