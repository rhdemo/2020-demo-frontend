const log = require("../../utils/log")("datagrid/game");
const readGame = require("../read-game");

async function gameHandler(client, changeType, key) {
  await readGame();
}


module.exports = gameHandler;
