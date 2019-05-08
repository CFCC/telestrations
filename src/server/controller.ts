import {Client, ContentType, IOEvent, NewContentDTO, Notepad, Player, UUID} from "../types";
import {remove} from 'lodash';
import {sleep} from "../util";

const players: Array<Player> = [];
let gameStarted = false;

function getNextPlayer(id: UUID): UUID {
    let index = players.findIndex(p => p.client.id === id);
    return players[index + 1 === players.length ? 0 : index + 1].client.id;
}

function finishedTurn(id: UUID, content: string): NewContentDTO {
    const player = players.find(p => p.client.id === id);
    if (!player) throw new Error('Player ID not found');

    const notepad = player.queue.shift();
    if (!notepad) throw new Error('Notepad not found!');
    notepad.content.push(content);

    const nextPlayer = players.find(p => p.client.id === getNextPlayer(id));
    if (!nextPlayer) throw new Error('Next player loop broken!');
    nextPlayer.queue.push(notepad);

    const newNotepad = player.queue[0];
    if (!newNotepad) {
        return {
            content: IOEvent.WAIT,
            type: ContentType.Text
        };
    }

    return newNotepad.owner === id ? {
        content: IOEvent.NO_MORE_CONTENT,
        type: ContentType.Text
    } : {
        content: newNotepad.content[newNotepad.content.length - 1],
        type: newNotepad.content.length - 1 % 2 === 0 ? ContentType.Text : ContentType.Picture
    }
}

async function getNewContent(id: UUID): Promise<NewContentDTO> {
    const player = players.find(p => p.client.id === id);
    if (!player) throw new Error('Player ID not found');

    let newNotepad: Notepad | null = null;
    while (!newNotepad) {
        await sleep(1000);
        newNotepad = player.queue[0];
    }

    return newNotepad.owner === id ? {
        content: IOEvent.NO_MORE_CONTENT,
        type: ContentType.Text
    } : {
        content: newNotepad.content[newNotepad.content.length - 1],
        type: newNotepad.content.length - 1 % 2 === 0 ? ContentType.Text : ContentType.Picture
    }
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
    players.forEach(player => player.queue.push({
        owner: player.client.id,
        content: []
    } as Notepad));
}

function isStarted(): boolean {
    return gameStarted;
}

export default {
    addPlayer, getPlayers, removePlayer, startGame, isStarted, finishedTurn, getNewContent
};