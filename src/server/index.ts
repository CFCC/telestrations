import * as socketIo from "socket.io";
import * as express from "express";
import * as http from "http";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import {serverEvents, clientEvents} from "./routes";
import {IOEvent} from "../types/shared";

dotenv.config({path: "../../.env"});
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
let serverWebapp = "";

export const imageFolder = fs.mkdtempSync(path.join(os.tmpdir(), "telestrations-"));

export const setServer = (s: string) => {
    serverWebapp = s;
};

export const getServer = (): string => serverWebapp;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/i/:image", (req, res) => {
    const image = path.join(imageFolder, req.params.image);
    if (fs.existsSync(image)) res.sendFile(image);
    else res.sendStatus(404);
});

io.on(IOEvent.NEW_CLIENT, client => {
    client.on(IOEvent.I_AM_A_SERVER, serverEvents(client));
    client.on(IOEvent.I_AM_A_CLIENT, clientEvents(client));
});

server.listen(process.env.REACT_APP_SERVER_PORT);
