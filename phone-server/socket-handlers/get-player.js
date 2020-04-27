const log = require('../utils/log')('socket-handlers/get-player');
const send = require('../utils/send');
const Player = require('../models/player');
const {OUTGOING_MESSAGE_TYPES, INCOMING_MESSAGE_TYPES} = require('./message-types');
const initHandler = require('./init');

async function getPlayer(ws, messageObj) {
  const {playerKey, playerId, requestId} = messageObj;
  let player = await fetchPlayer(ws, messageObj);
  if (!player) {
    player = await fetchPlayer(ws, messageObj);
  }
  if (!player) {
    player = await fetchPlayer(ws, messageObj);
  }

  if (!player) {
    let message = `Player ${playerKey} missing`;
    log.error(message);
    send(ws, JSON.stringify({type: OUTGOING_MESSAGE_TYPES.ERROR, requestId, error: {message}}));
    return null;
  }

  if (player.id !== playerId) {
    let message = `Player ID mismatch ${playerKey} playerId=${playerId}`;
    log.error(`${message} player.id=${player.id}`);
    send(ws, JSON.stringify({type: OUTGOING_MESSAGE_TYPES.ERROR, requestId, error: {message}}));
    return null;
  }

  return player;
}

async function fetchPlayer(ws, {playerKey}) {
  let player;
  try {
    player = await Player.find(playerKey);
  } catch (error) {
    let message = `Player ${playerKey} data not found.  Error message ${error.message}`;
    log.error(message);
  }
  return player;
}

async function reInitPlayer(ws, messageObj) {
  const {playerKey, playerId, gameId, requestId} = messageObj
  let player;

  try {
    player = await initHandler(ws, {type: INCOMING_MESSAGE_TYPES.INIT, playerKey, playerId, gameId});
    if (!player) {
      let message = `Failed to initialize missing player.`;
      log.error(message);
      send(ws, JSON.stringify({
        type: OUTGOING_MESSAGE_TYPES.ERROR,
        requestId: requestId,
        error: {message}
      }));
    }
  } catch (error) {
    let message = `Failed to initialize missing player.  Error message ${error.message}`;
    log.error(message);
    send(ws, JSON.stringify({type: OUTGOING_MESSAGE_TYPES.ERROR, requestId, error: {message}}));
  }
  return player;
}

module.exports.getPlayer = getPlayer;
module.exports.reInitPlayer = reInitPlayer;
