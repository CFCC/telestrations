import * as fs from "fs";
import * as path from "path";
import {findIndex, first, last, remove} from "lodash";
import {v4 as uuid} from "uuid";
import {sleep} from "../../src/utils";
import {NewContentDTO} from "../../src/types/server";
import {Notepad, Player} from "../../src/types/client";
import {ContentType, IOEvent, UUID} from "../../src/types/shared";
import {imageFolder} from "./index";

// region [Variables]

const players: Array<Player> = [];
let gameStarted = false;

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
    remove(players, {id});
}

export function updateGuess(id: UUID, content: string): string {
    const index = findIndex(players, {id});
    if (players[index].guess.type === ContentType.Text) {
        players[index].guess.content = content;
        return content;
    } else if (players[index].guess.type === ContentType.Picture) {
        let file = players[index].guess.content;

        if (!file) {
            file = `${uuid()}.png`;
            players[index].guess.content = file;
        }

        fs.writeFileSync(path.join(imageFolder, file), Buffer.from(content, "base64"));
        return `/i/${file}?v=${Math.floor(Math.random() * 99999)}`;
    } else {
        console.error("Wrong guess type");
        return "";
    }
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

    players[index].guess = {
        type: players[index].guess.type === ContentType.Picture ? ContentType.Text : ContentType.Picture,
        content: "",
    };

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
        content: last(newNotepad.content) || "",
        type: newNotepad.content.length - 1 % 2 === 0 ? ContentType.Text : ContentType.Picture,
    }
}

export async function getNewContent(id: UUID): Promise<NewContentDTO> {
    const index = findIndex(players, {id});
    let newNotepad: Notepad | undefined = undefined;
    while (!newNotepad) {
        // We have to wait for a new notepad to come in. We throttle the polling to 0.5s.
        await sleep(500);
        newNotepad = first(players[index].queue);
    }

    return newNotepad.owner === id ? {
        content: IOEvent.NO_MORE_CONTENT,
        type: ContentType.Text,
    } : {
        content: last(newNotepad.content) || "",
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
    return players.every((player: Player) => player.queue.length && player.queue[0].owner === player.id);
}

export function getNextPlayer(id: UUID): UUID {
    return players[(findIndex(players, {id}) + 1) % players.length].id;
}

export function getPlayers() {
    return players;
}

// endregion
