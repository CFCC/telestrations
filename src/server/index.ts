import * as socketIo from "socket.io";
import * as http from "http";
import * as dotenv from "dotenv";
import {serverEvents, clientEvents} from "./routes";
import {IOEvent} from "../types/shared";

dotenv.config({path: "../../.env"});
const server = http.createServer();
const io = socketIo.listen(server);
let serverWebapp: string = "";

export const setServer = (s: string) => {
    serverWebapp = s;
};

export const getServer = (): string => serverWebapp;

io.on(IOEvent.NEW_CLIENT, client => {
    client.on(IOEvent.I_AM_A_SERVER, serverEvents(client));
    client.on(IOEvent.I_AM_A_CLIENT, clientEvents(client));
});

server.listen(process.env.REACT_APP_SERVER_PORT);
