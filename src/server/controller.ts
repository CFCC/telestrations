import {ContentType, IOEvent, NewContentDTO, Notepad, Player, UUID} from "../types";
import {remove} from 'lodash';
import {sleep} from "../util";

// region [Variables]

const players: Array<Player> = [];
let gameStarted = false;

// endregion

// region [Functions of Routes]

// endregion

// region [Game Utilities]

// endregion

export function getNextPlayer(id: UUID): UUID {
    let index = players.findIndex(p => p.id === id);
    return players[index + 1 === players.length ? 0 : index + 1].id;
}

export function updateGuess(id: UUID, content: string) {
    let index = players.findIndex(p => p.id === id);
    players[index].guess.content = content;
}

export function finishedTurn(id: UUID): NewContentDTO {
    const index = players.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Player ID not found');

    const notepad = players[index].queue.shift();
    if (!notepad) throw new Error('Notepad not found!');
    notepad.content.push(players[index].guess.content);

    const nextIndex = players.findIndex(p => p.id === getNextPlayer(id));
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

export async function getNewContent(id: UUID): Promise<NewContentDTO> {
    const index = players.findIndex(p => p.id === id);
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

export function addPlayer(id: UUID, nickname: string) {
    players.push({
        id,
        nickname,
        guess: {content: '', type: ContentType.Text},
        queue: []
    });
}

export function getPlayers(): Array<Player> {
    return players;
}

export function removePlayer(id: UUID) {
    remove(players, p => p.id === id);
}

export function startGame() {
    gameStarted = true;
    players.forEach(player => player.queue.push({
        owner: player.id,
        content: []
    } as Notepad));
}

export function isStarted(): boolean {
    return gameStarted;
}

export function isFinished(): boolean {
    return players.every((player: Player) => player.queue[0].owner === player.id);
}