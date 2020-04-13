const log = require('../utils/log')('socket-handlers/bonus-guess');
const send = require('../utils/send');
const axios = require('../utils/axios');
const {OUTGOING_MESSAGE_TYPES} = require('./message-types');
const {DIGIT_RECOGNITION_URL} = require('../utils/constants');
const {GAME_STATES} = require('../models/constants');
const Player = require('../models/player');
const Configuration = require('../models/configuration');
const updateScore = require('./update-score');
const missingField = require('./missing-field');

async function bonusGuessHandler(ws, messageObj) {
  if (missingField(ws, messageObj, 'gameId') ||
    missingField(ws, messageObj, 'playerId') ||
    missingField(ws, messageObj, 'image')) {
    return;
  }

  let {playerId, gameId, image} = messageObj;

  if (gameId !== global.game.id) {
    let message = `Ignoring incoming guess because the game ID ${gameId} does not match ${global.game.id}`;
    log.warn(message);
    send(ws, JSON.stringify({type: OUTGOING_MESSAGE_TYPES.ERROR, requestId: messageObj.requestId, error: {message}}));
    return;
  }

  if (global.game.state !== GAME_STATES.BONUS) {
    let message = `Ignoring incoming bonus guess because the game is in state ${global.game.state}`;
    log.warn(message);
    send(ws, JSON.stringify({type: OUTGOING_MESSAGE_TYPES.ERROR, requestId: messageObj.requestId, error: {message}}));
    return;
  }


  let number = null;
  const startTime = new Date();

  try {
    const requestInfo = {
      timeout: 5000,
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
      url: new URL('/v1/models/mnist:predict', DIGIT_RECOGNITION_URL).href,
      data: {
        signature_name: 'serving_default',
        instances: [
          {
            reshape_1_input: image
          }
        ]
      }
    };

    const response = await axios(requestInfo);
    const probabilities = response.data.predictions[0];
    let max = null;
    probabilities.forEach((n, ndx) => {
      if (max === null || n > max) {
        max = n;
        number = ndx;
      }
    });
  } catch (error) {
    let message = 'error occurred in http call to digit recognition API:';
    log.error(message);
    log.error(error.message);
    send(ws, JSON.stringify({type: OUTGOING_MESSAGE_TYPES.ERROR, requestId: messageObj.requestId, error: {message}}));
    return;
  }

  const endTime = new Date();
  const timeDiff = endTime - startTime;

  if (timeDiff > 300) {
    log.warn(`Digit recognition service request took ${timeDiff} ms`);
  }


  let player;
  try {
    player = await Player.find(playerId);
  } catch (error) {
    log.error(`Player ${playerId} data not found`);
    return;
  }

  let destination;
  for (let i = 0; i < player.currentRound.answers.length; i++) {
    let a = player.currentRound.answers[i];
    if (a.format === 'number' && a.result !== 'correct') {
      destination = i;
      break;
    }
  }

  let source = player.currentRound.choices.indexOf(number);
  if (source < 0) {
    source = 'bonus';
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

module.exports = bonusGuessHandler;
