import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import {findIndex, first, last, remove} from "lodash";
import * as uuid from "uuid/v4";
import {sleep} from "../utils";
import {NewContentDTO} from "../types/server";
import {Notepad, Player} from "../types/client";
import {ContentType, IOEvent, UUID} from "../types/shared";

// region [Variables]

const players: Array<Player> = [];
let gameStarted = false;
const tempFolder = fs.mkdtempSync(path.join(os.tmpdir(), "telestrations-"));

// endregion

// region [Functions of Routes]

export function addPlayer(id: UUID, nickname: string) {
    players.push({
        id,
        nickname,
        guess: {content: "", type: ContentType.Text},
        queue: [{
            owner: id,
            content: [],
        } as Notepad],
    });
}

export function removePlayer(id: UUID) {
    remove(players, p => p.id === id);
}

export function updateGuess(id: UUID, content: string | Buffer) {
    if (typeof content === "string") updateTextGuess(id, content);
    else if (content instanceof Buffer) updatePictureGuess(id, content);
    else console.error("Wrong content type");
}

export function finishedTurn(id: UUID): NewContentDTO {
    const index = players.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Player ID not found");

    const notepad = players[index].queue.shift();
    if (!notepad) throw new Error("Notepad not found!");
    notepad.content.push(players[index].guess.content);

    const nextIndex = players.findIndex(p => p.id === getNextPlayer(id));
    if (nextIndex === -1) throw new Error("Next player loop broken!");
    players[nextIndex].queue.push(notepad);

    const newNotepad = first(players[index].queue);
    if (!newNotepad) {
        return {
            content: IOEvent.WAIT,
            type: ContentType.Text,
        };
    }

    return newNotepad.owner === id ? {
        content: IOEvent.NO_MORE_CONTENT,
        type: ContentType.Text,
    } : {
        content: last(newNotepad.content),
        type: newNotepad.content.length - 1 % 2 === 0 ? ContentType.Text : ContentType.Picture,
    }
}

export async function getNewContent(id: UUID): Promise<NewContentDTO> {
    const index = findIndex(players, {id});
    let newNotepad: Notepad | null = null;
    while (!newNotepad) {
        // We have to wait for a new notepad to come in. We throttle the polling to 0.5s.
        await sleep(500);
        newNotepad = first(players[index].queue);
    }

    return newNotepad.owner === id ? {
        content: IOEvent.NO_MORE_CONTENT,
        type: ContentType.Text,
    } : {
        content: last(newNotepad.content),
        type: newNotepad.content.length - 1 % 2 === 0 ? ContentType.Text : ContentType.Picture,
    }
}

export function startGame() {
    gameStarted = true;
}

// endregion

// region [Game Utilities]

export function isStarted(): boolean {
    return gameStarted;
}

export function isFinished(): boolean {
    return players.every((player: Player) => player.queue[0].owner === player.id);
}

export function getNextPlayer(id: UUID): UUID {
    return players[findIndex(players, {id}) + 1 % players.length].id;
}

export function getPlayers() {
    return players;
}

function updateTextGuess(id: UUID, content: string) {
    const index = findIndex(players, {id});
    players[index].guess.content = content;
}

function updatePictureGuess(id: UUID, content: Buffer) {
    const index = findIndex(players, {id});
    let file = players[index].guess.content;

    if (!file) {
        file = `${uuid()}.png`;
        players[index].guess.content = file;
    }

    fs.writeFileSync(path.join(tempFolder, file), content);
}

// endregion
