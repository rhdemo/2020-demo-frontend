const log = require("../utils/log")("datagrid/create-game");
const {DATAGRID_KEYS} = require("./constants");
const Game = require("../models/game");

async function createGame() {
    let gameStr = await global.dataClient.get(DATAGRID_KEYS.GAME);

    if (gameStr) {
        global.game = JSON.parse(gameStr);
    } else {
        global.game = new Game();
        log.debug("Game not found, writing new game: " + JSON.stringify(global.game));
        global.dataClient.put(DATAGRID_KEYS.GAME, JSON.stringify(global.game));
    }

    return global.game;
}

module.exports = createGame;

