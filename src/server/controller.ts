import {Client, ContentType, IOEvent, NewContentDTO, Notepad, Player, UUID} from "../types";
import {remove} from 'lodash';

const players: Array<Player> = [];
let gameStarted = false;
let notepads: Array<Notepad> = [];

function getNextPlayer(id: UUID): UUID {
    let index = players.findIndex(p => p.client.id === id);
    return players[index + 1 === players.length ? 0 : index + 1].client.id;
}

function finishedTurn(id: UUID, content: string): NewContentDTO {
    let gameItem = notepads.find(gi => gi.owner === id);
    if (gameItem) gameItem.content.push(content);

    gameItem = notepads.find(gi => gi.owner === getNextPlayer(id));
    if (!gameItem) {
        return {
            content: "",
            type: ContentType.Text
        };
    }

    // TODO: Definitely incorrect logic
    return gameItem.owner === id ? {
        content: gameItem.content[gameItem.content.length],
        type: gameItem.content.length % 2 === 0 ? ContentType.Picture : ContentType.Text
    } : {
        content: IOEvent.NO_MORE_CONTENT,
        type: ContentType.Text
    };
}

function addPlayer(client: Client) {
    players.push({
        client,
        queue: []
    });
}

function getPlayers(): Array<Player> {
    return players;
}

function removePlayer(player: Client) {
    remove(players, p => p.client.id === player.id);
}

function startGame() {
    gameStarted = true;
    notepads = players.map(player => ({
        owner: player.client.id,
        content: []
    } as Notepad));
}

function isStarted(): boolean {
    return gameStarted;
}

export default {
    addPlayer, getPlayers, removePlayer, startGame, isStarted, finishedTurn
};