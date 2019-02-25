const players = [];

function addPlayerToGame(player) {
    players.push(player);
}

function getPlayers() {
    return players;
}

export default {
    addPlayerToGame, getPlayers
};