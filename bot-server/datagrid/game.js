const readGame = require("./read-game");

async function gameHandler(client, changeType, key) {
    await readGame();
}


module.exports = gameHandler;
