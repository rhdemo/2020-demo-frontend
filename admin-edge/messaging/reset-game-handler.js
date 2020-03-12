const lodashGet = require('lodash/get');
const log = require('../utils/log')('messaging/reset-game-handler');
const {GAME_DATA_KEYS} = require('../models/constants');
const Game = require("../models/game");
const Player = require("../models/player");


async function resetGameHandler(message) {
  if (global.game.id === lodashGet(message, 'body.game.id')) {
    return;  //already reset
  }

  let game = new Game();
  game.updateAttributes(lodashGet(message, 'body.game'));

  const gameSavePromise = game.save();
  const playerDeleteAllPromise = Player.deleteAll();
  try {
    await gameSavePromise;
    global.game = game;
    await playerDeleteAllPromise;
  } catch (error) {
    log.error(`error occurred resetting players and game. Error:`, error);
  }
}

module.exports = resetGameHandler;
