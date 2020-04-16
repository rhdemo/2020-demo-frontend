const lodashGet = require('lodash/get');
const log = require('../../utils/log')('messaging/game-handler');
const {GAME_DATA_KEYS} = require("../../datagrid/game-constants");

async function gameHandler(bodyObj) {
  log.info('incoming message', bodyObj);

  const newGame = lodashGet(bodyObj, 'game');
  if (!newGame) {
    return;
  }

  if (isCurrent(newGame)) {
    log.info('Ignoring game change, already updated.');
    return;
  }

  try {
    log.info('Updating game');
    global.game = newGame;
    await global.gameData.put(GAME_DATA_KEYS.CURRENT_GAME, JSON.stringify(global.game));
  } catch (error) {
    log.error("Failed to update game. Error:", error);
  }
}

function isCurrent(game) {
  if (global.game.id !== game.id) {
    return false;
  }
  if (global.game.state !== game.state) {
    return false;
  }
  if (global.game.date !== game.date) {
    return false;
  }
  return true;
}

module.exports = gameHandler;
