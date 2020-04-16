const log = require("../utils/log")("datagrid/poll-datagrid");
const initGame = require("./init-game-data");
const {GAME_DATA_KEYS} = require("./game-constants");


function pollDatagrid(interval) {
  setTimeout(async () => {
    log.trace("checking Datagrid connections");
    await checkGameClient();
    pollDatagrid(interval);
  }, interval);
}

async function checkGameClient() {
  log.trace("check Infinispan Game Client");
  try {
    let str = await global.gameData.get(GAME_DATA_KEYS.CURRENT_GAME);
    if (str) {
      global.game = JSON.parse(str);
    } else {
      log.error("Game configuration missing");
    }
  } catch (e) {
    log.error("Error connecting to Infinispan game cache", e.message);
    await reconnectGameClient();
  }
}

async function reconnectGameClient() {
  log.info("Attempting to reconnect to Infinispan game cache");
  try {
    await initGame();
  } catch (e) {
    log.error("Failed to reconnect to Infinispan game cache.  Error: ", e.message);
  }
}

module.exports = pollDatagrid;
