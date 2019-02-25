const players: Array<String> = [];

function addPlayerToGame(player: String) {
    players.push(player);
}

function getPlayers() {
    return players;
}

export default {
    addPlayerToGame, getPlayers
};