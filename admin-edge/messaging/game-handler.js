const lodashGet = require('lodash/get');
const log = require('../utils/log')('messaging/game-handler');
const Game = require("../models/game");

async function gameHandler(message) {
  let game = new Game();
  game.updateAttributes(lodashGet(message, 'body.game'));

  try {
    await game.save();
    global.game = game;
  } catch (error) {
    log.error("Failed to update game. Error:", error);
  }
}

module.exports = gameHandler;

