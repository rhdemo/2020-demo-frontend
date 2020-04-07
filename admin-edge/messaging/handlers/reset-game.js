const lodashGet = require('lodash/get');
const log = require('../../utils/log')('messaging/reset-game-handler');
const {GAME_DATA_KEYS} = require("../../datagrid/game-constants");


async function resetGameHandler(bodyObj) {
  log.info('incoming message', bodyObj);
  const newGame = lodashGet(bodyObj, 'game')
  if (global.game.id === newGame.id) {
    log.info('Ignoring game reset, already reset.');
    return;
  }

  log.info('Updating game');
  global.game = newGame;
  const gameSavePromise = global.gameData.put(GAME_DATA_KEYS.CURRENT_GAME, JSON.stringify(global.game));
  const deletePlayersPromise = global.playerData.clear();
  try {
    await gameSavePromise;
    await deletePlayersPromise;
  } catch (error) {
    log.error(`error occurred resetting players and game. Error:`, error);
  }
}

module.exports = resetGameHandler;
