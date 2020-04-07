const log = require("../../utils/log")("datagrid/game");
const readBotConfig = require("../read-bot-config");

async function gameHandler(client, changeType, key) {
  await readBotConfig();
}


module.exports = gameHandler;
