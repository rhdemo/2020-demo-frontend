const lodashGet = require('lodash/get');
const log = require('../utils/log')('messaging/game-handler');
const Game = require("../models/game");

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

  let game = new Game();
  game.updateAttributes(lodashGet(bodyObj, 'game'));

  try {
    log.info('Updating game');
    await game.save();
    global.game = game;
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

