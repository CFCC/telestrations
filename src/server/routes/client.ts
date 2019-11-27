import * as game from "../controller";
import * as uuid from "uuid/v4";
import {FinishedGameTurnDTO, NewContentDTO} from "../../types/server";
import {IOEvent, UUID} from "../../types/shared";
import {getServer} from "..";
import {Socket} from "socket.io";

export default (client: Socket) => () => {
    if (game.isStarted()) {
        client.emit(IOEvent.GAME_ALREADY_STARTED);
        client.disconnect(true);
        return;
    }

    client.on(IOEvent.SUBMIT_NICK, (nickname: string) => {
        const server = getServer();
        const id: UUID = uuid();

        game.addPlayer(id, nickname);
        if (server) client.broadcast.to(server).emit(IOEvent.PLAYER_ADDED, {id, nickname});

        client.on(IOEvent.UPDATE_GUESS, (content: string) => {
            game.updateGuess(id, content);
            if (server) client.broadcast.to(server).emit(IOEvent.UPDATE_GUESS, {
                playerId: id,
                content,
            });
        });

        client.on(IOEvent.FINISHED_GAME_TURN, () => {
            const newContent: NewContentDTO = game.finishedTurn(id);
            if (server) client.broadcast.to(server).emit(IOEvent.FINISHED_GAME_TURN, {playerId: id});

            switch (newContent.content) {
                case IOEvent.NO_MORE_CONTENT:
                    client.emit(IOEvent.NO_MORE_CONTENT);
                    if (game.isFinished() && server) client.broadcast.to(server).emit(IOEvent.GAME_FINISHED);
                    break;
                case IOEvent.WAIT:
                    client.emit(IOEvent.WAIT);
                    game.getNewContent(id).then((content: NewContentDTO) => {
                        if (content.content === IOEvent.NO_MORE_CONTENT) {
                            client.emit(IOEvent.NO_MORE_CONTENT);
                        } else {
                            client.emit(IOEvent.NEW_CONTENT, content);
                            if (server) client.broadcast.to(server).emit(IOEvent.NEW_CONTENT, {
                                playerId: id,
                                newNotepadOwnerId: game.getNextPlayer(id),
                            } as FinishedGameTurnDTO);
                        }
                    });
                    break;
                default:
                    client.emit(IOEvent.NEW_CONTENT, newContent);
                    if (server) client.broadcast.to(server).emit(IOEvent.NEW_CONTENT, {
                        playerId: id,
                        newNotepadOwnerId: game.getNextPlayer(id),
                    } as FinishedGameTurnDTO);
            }
        });

        client.on(IOEvent.DISCONNECT, () => {
            game.removePlayer(id);

            // if (!game.isStarted()) {
            //     io.emit(IOEvent.PLAYER_REMOVED, id);
            // }
        });
    });
};
