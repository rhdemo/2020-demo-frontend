const log = require('../utils/log')('socket-handlers/guess');
const send = require('../utils/send');
const {GAME_STATES} = require('../models/constants');
const Player = require('../models/player');
const Configuration = require('../models/configuration');
const {OUTGOING_MESSAGE_TYPES} = require('./message-types');
const updateScore = require('./update-score');
const missingField = require('./missing-field');

async function guessHandler(ws, messageObj) {
  if (missingField(ws, messageObj, 'gameId') ||
    missingField(ws, messageObj, 'playerId') ||
    missingField(ws, messageObj, 'itemId') ||
    missingField(ws, messageObj, 'number') ||
    missingField(ws, messageObj, 'source') ||
    missingField(ws, messageObj, 'destination')) {
    return;
  }

  let {playerId, gameId, itemId, number, source, destination} = messageObj;

  if (gameId !== global.game.id) {
    let message = `Ignoring incoming guess because the game ID ${gameId} does not match ${global.game.id}`;
    log.warn(message);
    send(ws, JSON.stringify({type: OUTGOING_MESSAGE_TYPES.ERROR, requestId: messageObj.requestId, error: {message}}));
    return;
  }

  if (global.game.state !== GAME_STATES.ACTIVE) {
    let message = `Ignoring incoming guess because the game is in state ${global.game.state}`;
    log.warn(message);
    send(ws, JSON.stringify({type: OUTGOING_MESSAGE_TYPES.ERROR, requestId: messageObj.requestId, error: {message}}));
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
    let updatedPlayer = await updateScore(player, number, source, destination);
    if (updatedPlayer) {
      let configuration = new Configuration(updatedPlayer);
      configuration.requestId = messageObj.requestId;
      send(ws, JSON.stringify(configuration));
    } else {
      send(ws, JSON.stringify({type: OUTGOING_MESSAGE_TYPES.ERROR, requestId: messageObj.requestId}));
    }
  } catch (error) {
    log.error('Score update failed.');
    let configuration = new Configuration(player);
    configuration.requestId = messageObj.requestId;
    send(ws, JSON.stringify(configuration));
    send(ws, JSON.stringify({type: OUTGOING_MESSAGE_TYPES.ERROR, requestId: messageObj.requestId}));
  }
}

module.exports = guessHandler;
