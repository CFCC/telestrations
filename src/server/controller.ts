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
    const index = players.findIndex(p => p.client.id === id);
    if (index === -1) throw new Error('Player ID not found');

    const notepad = players[index].queue.shift();
    if (!notepad) throw new Error('Notepad not found!');
    notepad.content.push(content);

    const nextIndex = players.findIndex(p => p.client.id === getNextPlayer(id));
    if (nextIndex === -1) throw new Error('Next player loop broken!');
    players[nextIndex].queue.push(notepad);

    const newNotepad = players[index].queue[0];
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
    const index = players.findIndex(p => p.client.id === id);
    if (index === -1) throw new Error('Player ID not found');

    let newNotepad: Notepad | null = null;
    while (!newNotepad) {
        await sleep(1000);
        newNotepad = players[index].queue[0];
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

function isFinished(): boolean {
    return players.every((player: Player) => player.queue[0].owner === player.client.id);
}

export default {
    addPlayer, getPlayers, removePlayer, startGame, isStarted, finishedTurn, getNewContent
};