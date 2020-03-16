const lodashGet = require('lodash/get');
const log = require('../utils/log')('messaging/reset-game-handler');
const Game = require("../models/game");


async function resetGameHandler(message) {
  if (global.game.id === lodashGet(message, 'body.game.id')) {
    return;  //already reset
  }

  let game = new Game();
  game.updateAttributes(lodashGet(message, 'body.game'));

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
