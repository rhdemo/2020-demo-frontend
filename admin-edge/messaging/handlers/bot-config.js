const lodashGet = require('lodash/get');
const log = require('../../utils/log')('messaging/game-handler');
const {GAME_DATA_KEYS} = require("../../datagrid/game-constants");

async function botConfigHandler(bodyObj) {
  log.trace('incoming message', bodyObj);

  const botConfig = lodashGet(bodyObj, 'botConfig');

  if (!botConfig) {
    return;
  }

  try {
    log.info('Updating bot config');
    await global.gameData.put(GAME_DATA_KEYS.BOT_CONFIG, JSON.stringify(botConfig));
  } catch (error) {
    log.error("Failed to update bot config. Error:", error);
  }
}

module.exports = botConfigHandler;
