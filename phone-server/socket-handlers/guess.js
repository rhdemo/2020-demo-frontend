const log = require('../utils/log')('socket-handlers/guess');
const send = require('../utils/send');
const {GAME_STATES} = require('../models/constants');
const Player = require('../models/player');
const Configuration = require('../models/configuration');

async function guessHandler(ws, messageObj) {
  let guess = messageObj;

  let {playerId, gameId, choices, answers} = guess;
  if (!gameId || gameId !== global.game.id || !playerId || !choices || !answers) {
    log.warn('Ignoring incoming malformed guess data.');
    return;
  }

  if (global.game.state !== GAME_STATES.ACTIVE) {
    log.warn(`Ignoring incoming guess because the game is in state ${global.game.state}`);
    return;
  }

  let player;
  try {
    player = await Player.find(playerId);
  } catch (error) {
    log.error(`Player ${playerId} data not found`);
    return;
  }

  player.addGuess(guess);

  try {
    await player.save();
  } catch (error) {
    log.error(`Player ${playerId} data not saved`);
    return;
  }

  let configuration = new Configuration(player);
  log.debug(configuration);
  send(ws, JSON.stringify(configuration));
}
module.exports = guessHandler;
