const log = require('../utils/log')('socket-handlers/bonus-guess');
const send = require('../utils/send');
const axios = require('../utils/axios');
const {DIGIT_RECOGNITION_URL} = require('../utils/constants');
const {GAME_STATES} = require('../models/constants');
const Player = require('../models/player');
const Configuration = require('../models/configuration');
const updateScore = require('./update-score');

async function bonusGuessHandler(ws, messageObj) {
  let bonusGuess = messageObj;

  let {playerId, gameId, image} = bonusGuess;
  if (!gameId || gameId !== global.game.id || !playerId || !image) {
    log.warn('Ignoring incoming malformed guess data.');
    return;
  }

  if (global.game.state !== GAME_STATES.BONUS) {
    log.warn(`Ignoring incoming bonus guess because the game is in state ${global.game.state}`);
    return;
  }


  let number = null;
  const startTime = new Date();

  try {
    const requestInfo = {
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      url: new URL("/v1/models/mnist:predict", DIGIT_RECOGNITION_URL).href,
      data: {
        signature_name: "predict_images",
        instances: [
          {
            images: image,
            keep_prob: [1.0]
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
    log.error("error occurred in http call to digit recognition API:");
    log.error(error.message);
    return null;
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

  let answers = [...player.currentRound.answers];
  for (let i = 0; i < answers.length; i++) {
    let a = answers[i];
    if (a.format === "number" && a.result !== "correct") {
      a.number = number;
      a.result = null;
      a.from = 'bonus';
      break;
    }
  }

  try {
    let updatedPlayer = await updateScore(player, answers);
    if (updatedPlayer) {
      let configuration = new Configuration(updatedPlayer);
      send(ws, JSON.stringify(configuration));
    }
  } catch (error) {
    log.error('Score update failed.');
  }
}

module.exports = bonusGuessHandler;
