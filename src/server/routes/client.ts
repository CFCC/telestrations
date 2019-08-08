import * as game from "../controller";
import uuid from "uuid/v4";
import {FinishedGameTurnDTO, NewContentDTO, RoutesConfig} from "../../types/server";
import {IOEvent, UUID} from "../../types/shared";

export default (config: RoutesConfig) => () => {
    const {client, io, serverWebapp} = config;

    if (game.isStarted()) {
        client.emit(IOEvent.GAME_ALREADY_STARTED)
    } else {
        client.on(IOEvent.SUBMIT_NICK, (nickname: string) => {
            const id: UUID = uuid();
            game.addPlayer(id, nickname);
            if (serverWebapp) serverWebapp.emit(IOEvent.PLAYER_ADDED, {id, nickname});

            client.on(IOEvent.UPDATE_GUESS, (content: string) => {
                game.updateGuess(id, content);
                if (serverWebapp) serverWebapp.emit(IOEvent.UPDATE_GUESS, {
                    playerId: id,
                    content
                });
            });

            client.on(IOEvent.FINISHED_GAME_TURN, () => {
                const newContent: NewContentDTO = game.finishedTurn(id);
                if (serverWebapp) serverWebapp.emit(IOEvent.FINISHED_GAME_TURN, {playerId: id});

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
                                if (serverWebapp) serverWebapp.emit(IOEvent.NEW_CONTENT, {
                                    playerId: id,
                                    newNotepadOwnerId: game.getNextPlayer(id)
                                } as FinishedGameTurnDTO);
                            }
                        });
                        client.emit(IOEvent.WAIT);
                        break;
                    default:
                        client.emit(IOEvent.NEW_CONTENT, newContent);
                        if (serverWebapp) serverWebapp.emit(IOEvent.NEW_CONTENT, {
                            playerId: id,
                            newNotepadOwnerId: game.getNextPlayer(id)
                        } as FinishedGameTurnDTO);
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
};