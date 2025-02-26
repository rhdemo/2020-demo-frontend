const log = require("../utils/log")("datagrid/read-game");
const {GAME_DATA_KEYS} = require("../models/constants");

async function readGame() {
  try {
    let str = await global.gameData.get(GAME_DATA_KEYS.CURRENT_GAME);
    if (str) {
      global.game = JSON.parse(str);
    } else {
      log.error("Game configuration missing");
    }
  } catch (error) {
    log.error("Failed to read game. Error:", error.message);
  }
}

module.exports = readGame;

