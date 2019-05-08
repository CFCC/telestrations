import socketIo from 'socket.io';
import http from 'http';
import game from './controller';
import uuid from 'uuid/v4';
import {Client, ContentType, IOEvent, NewContentDTO} from "../types";
import {sleep} from "../util";

const server = http.createServer();
const io = socketIo(server);
let serverWebapp;
let clients: Array<Client> = [];

io.on(IOEvent.NEW_CLIENT, client => {
    client.on(IOEvent.I_AM_A_SERVER, () => {
        serverWebapp = client;

        client.on(IOEvent.START_GAME, () => {
            io.emit(IOEvent.START_GAME);
            game.startGame();
        });
    });

    client.on(IOEvent.I_AM_A_CLIENT, () => {
        if (game.isStarted()) {
            client.emit(IOEvent.GAME_ALREADY_STARTED)
        } else {
            client.on(IOEvent.SUBMIT_NICK, (nickname: string) => {
                const c = {
                    id: uuid(),
                    nickname,
                    socket: client
                };

                clients.push(c);
                game.addPlayer(c);
                io.emit(IOEvent.PLAYER_ADDED, game.getPlayers().map(p => p.client.nickname));

                client.on(IOEvent.FINISHED_GAME_TURN, (packet: string) => {
                    const newContent: NewContentDTO = game.finishedTurn(c.id, packet);
                    switch(newContent.content) {
                        case IOEvent.NO_MORE_CONTENT:
                            client.emit(IOEvent.NO_MORE_CONTENT);
                            break;
                        case IOEvent.WAIT:
                            game.getNewContent(c.id).then((content: NewContentDTO) => {
                                if (content.content === IOEvent.NO_MORE_CONTENT) {
                                    client.emit(IOEvent.NO_MORE_CONTENT);
                                } else {
                                    client.emit(IOEvent.NEW_CONTENT, content);
                                }
                            });
                            client.emit(IOEvent.WAIT);
                            break;
                        default:
                            client.emit(IOEvent.NEW_CONTENT, newContent);
                    }
                });

                client.on(IOEvent.DISCONNECT, () => {
                    game.removePlayer(c);

                    if (!game.isStarted()) {
                        io.emit(IOEvent.PLAYER_REMOVED, c.id);
                    }
                });
            });
        }
    });
});

server.listen(8081);