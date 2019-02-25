import socketIo from 'socket.io';
import http from 'http';
import controller from './controller';

const server = http.createServer();
const io = socketIo(server);
let serverWebapp;
let clients = [];

io.on('connection', client => {
    client.on('i am a server', () => {
        serverWebapp = client;
    });

    client.on('i am a client', () => {
        clients.push(client);

        controller.addPlayerToGame();
        server.emit('player added', controller.getPlayers());
    });

    client.on('start game', () => io.emit('start game'));

    client.on('finished game turn', packet => {

    });
});

server.listen(8081);