const Game = require("../models/game");
const {DATAGRID_KEYS} = require("../datagrid/constants");

async function resetGameHandler(ws, messageObj) {
  console.log('resetGameHandler');
  try {
    await global.playerClient.clear();
  } catch (error) {
    log.error(`error occurred resetting players. Error:`, error.message);
  }

  try {
    await global.dataClient.put(DATAGRID_KEYS.GAME, JSON.stringify(new Game()));
  } catch (error) {
    log.error(`error occurred creating new game. Error:`, error.message);
  }
}

module.exports = resetGameHandler;
