import socketIo from 'socket.io';
import http from 'http';
import game from './controller';
import uuid from 'uuid/v4';
import {Client, IOEvent} from "../types";

const server = http.createServer();
const io = socketIo(server);
let serverWebapp;
let clients: Array<Client> = [];
let gameStarted: boolean = false;

io.on(IOEvent.NEW_CLIENT, client => {
    client.on(IOEvent.I_AM_A_SERVER, () => {
        serverWebapp = client;

        client.on(IOEvent.START_GAME, () => {
            io.emit(IOEvent.START_GAME);
            gameStarted = true;
            // Maybe set up?
        });
    });

    client.on(IOEvent.I_AM_A_CLIENT, () => {
        if (gameStarted) {
            client.emit(IOEvent.GAME_ALREADY_STARTED)
        } else {
            client.on(IOEvent.SUBMIT_NICK, (nickname: String) => {
                const c = {
                    id: uuid(),
                    nickname,
                    socket: client
                };

                clients.push(c);
                game.addPlayerToGame(c);
                io.emit(IOEvent.PLAYER_ADDED, game.getPlayers().map(p => p.nickname));

                client.on(IOEvent.FINISHED_GAME_TURN, packet => {

                });

                client.on(IOEvent.DISCONNECT, () => {
                    if (!game.isStarted()) {
                        game.removePlayer(c);
                        io.emit(IOEvent.PLAYER_ADDED, game.getPlayers());
                    } else {
                        // Update the loop to skip the player, but still keep their data
                        // to present at the end
                    }
                });
            });
        }
    });
});

server.listen(8081);