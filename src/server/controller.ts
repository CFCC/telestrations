import {Client, GameItem} from "../../types";
import {remove} from 'lodash';

const players: Array<Client> = [];
let gameStarted = false;
const game: Array<GameItem> = [];

function addPlayer(player: Client) {
    players.push(player);
}

function getPlayers(): Array<Client> {
    return players;
}

function removePlayer(player: Client) {
    remove(players, p => p.id === player.id);
}

function startGame() {
    gameStarted = true;
}

function isStarted(): boolean {
    return gameStarted;
}

export default {
    addPlayerToGame: addPlayer, getPlayers, removePlayer, startGame, isStarted
};