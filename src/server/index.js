import socketIo from 'socket.io';
import http from 'http';
import controller from './controller';

const server = http.createServer();
const io = socketIo(server);

io.on('connection', client => {
    controller.addPlayerToGame();

    client.on('event', data => { /* … */ });
    client.on('disconnect', () => { /* … */ });
});

server.listen(8081);