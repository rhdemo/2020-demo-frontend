const log = require('../utils/log')('game-socket-handler');
const Game = require("../models/game");
const {GAME_DATA_KEYS} = require("../models/constants");

async function gameHandler(ws, messageObj) {
  let game;
  try {
    game = await Game.find(GAME_DATA_KEYS.CURRENT_GAME);
  } catch (error) {
    log.error("Failed to read game. Error:", error.message);
    return;
  }

  if (!game) {
    game = new Game();
  }

  game.updateAttributes(messageObj.game);

  try {
    let result = await game.save();
    return result;
  } catch (error) {
    log.error("Failed to update game. Error:", error.message);
  }
}

module.exports = gameHandler;

