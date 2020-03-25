const log = require('../utils/log')('socket-handlers/guess');
const send = require('../utils/send');
const {GAME_STATES} = require('../models/constants');
const Player = require('../models/player');
const Configuration = require('../models/configuration');
const {OUTGOING_MESSAGE_TYPES} = require("./message-types");
const updateScore = require('./update-score');

async function guessHandler(ws, messageObj) {
  let {playerId, gameId, answers} = messageObj;
  if (!gameId || gameId !== global.game.id || !playerId || !answers) {
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

  try {
    let updatedPlayer = await updateScore(player, answers);
    if (updatedPlayer) {
      let configuration = new Configuration(updatedPlayer);
      send(ws, JSON.stringify(configuration));
    } else {
      send(ws, JSON.stringify({type: OUTGOING_MESSAGE_TYPES.ERROR}));
    }
  } catch (error) {
    log.error('Score update failed.');
    let configuration = new Configuration(player);
    send(ws, JSON.stringify(configuration));
    send(ws, JSON.stringify({type: OUTGOING_MESSAGE_TYPES.ERROR}));
  }
}

module.exports = guessHandler;
