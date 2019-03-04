import socketIo from 'socket.io';
import http from 'http';
import game from './controller';
import uuid from 'uuid/v4';
import {Client} from "../../types";

const server = http.createServer();
const io = socketIo(server);
let serverWebapp;
let clients: Array<Client> = [];

io.on('connection', client => {
    client.on('i am a server', () => {
        console.log('we have our server!');
        serverWebapp = client;

        client.on('start game', () => {
            io.emit('start game');
            // Maybe set up?
        });
    });

    client.on('i am a client', () => {
        client.on('submit nick', (nickname: String) => {
            const c = {
                id: uuid(),
                nickname,
                socket: client
            };

            clients.push(c);

            game.addPlayerToGame(name);
            io.emit('player added', game.getPlayers());

            client.on('finished game turn', packet => {

            });

            client.on('disconnect', () => {
                if (!game.isStarted()) {
                    game.removePlayer(c);
                    io.emit('player added', game.getPlayers());
                } else {
                    // Update the loop to skip the player, but still keep their data
                    // to present at the end
                }
            });
        });
    });
});

server.listen(8081);