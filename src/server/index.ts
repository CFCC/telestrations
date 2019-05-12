import socketIo, {Socket} from 'socket.io';
import http from 'http';
import * as game from './controller';
import uuid from 'uuid/v4';
import {IOEvent, NewContentDTO, UUID} from "../types";

const server = http.createServer();
const io = socketIo(server);
let serverWebapp: null | Socket;

io.on(IOEvent.NEW_CLIENT, client => {
    client.on(IOEvent.I_AM_A_SERVER, () => {
        if (serverWebapp) return client.disconnect(true);

        serverWebapp = client;

        client.on(IOEvent.START_GAME, () => {
            io.emit(IOEvent.START_GAME);
            game.startGame();
        });

        client.on(IOEvent.DISCONNECT, () => {
            serverWebapp = null;
        })
    });

    client.on(IOEvent.I_AM_A_CLIENT, () => {
        if (game.isStarted()) {
            client.emit(IOEvent.GAME_ALREADY_STARTED)
        } else {
            client.on(IOEvent.SUBMIT_NICK, (nickname: string) => {
                const id: UUID = uuid();
                game.addPlayer(id, nickname);
                io.emit(IOEvent.PLAYER_ADDED, game.getPlayers().map(p => p.nickname));

                client.on(IOEvent.UPDATE_GUESS, (content: string) => {
                    game.updateGuess(id, content);
                    if (serverWebapp) serverWebapp.emit(IOEvent.UPDATE_GUESS, {
                        playerId: id,
                        content
                    });
                });

                client.on(IOEvent.FINISHED_GAME_TURN, () => {
                    const newContent: NewContentDTO = game.finishedTurn(id);
                    switch(newContent.content) {
                        case IOEvent.NO_MORE_CONTENT:
                            client.emit(IOEvent.NO_MORE_CONTENT);
                            if (game.isFinished() && serverWebapp) serverWebapp.emit(IOEvent.GAME_FINISHED);
                            break;
                        case IOEvent.WAIT:
                            game.getNewContent(id).then((content: NewContentDTO) => {
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
                    game.removePlayer(id);

                    if (!game.isStarted()) {
                        io.emit(IOEvent.PLAYER_REMOVED, id);
                    }
                });
            });
        }
    });
});

server.listen(8081);