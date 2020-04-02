const lodashGet = require('lodash/get');
const log = require('../utils/log')('messaging/reset-game-handler');
const Game = require("../models/game");


async function resetGameHandler(bodyObj) {
  log.info('incoming message', bodyObj);
  const newGame = lodashGet(bodyObj, 'game')
  if (global.game.id === newGame.id) {
    log.info('Ignoring game reset, already reset.');
    return;
  }

  let game = new Game();
  game.updateAttributes(newGame);

  log.info('Updating game');
  const gameSavePromise = game.save();
  const deletePlayersPromise = global.playerData.clear();
  try {
    await gameSavePromise;
    global.game = game;
    await deletePlayersPromise;
  } catch (error) {
    log.error(`error occurred resetting players and game. Error:`, error);
  }
}

module.exports = resetGameHandler;
