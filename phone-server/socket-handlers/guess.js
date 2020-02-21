const log = require('../utils/log')('socket-handlers/guess');
const send = require('../utils/send');
const axios = require('../utils/axios');
const {SCORING_URL} = require('../utils/constants');
const {GAME_STATES} = require('../models/constants');
const itemData = require('../models/item-data');
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

  let guessResult = null;
  let retries = 5;
  while (retries > 0 && !guessResult) {
    try {
      const response = await axios({
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
        url: SCORING_URL,
        data: {
          game: global.game,
          player: {
            id: player.id,
            username: player.username,
            score: player.score
          },
          item: itemData[player.currentRound.itemId],
          answers,
          pointsAvailable: player.currentRound.points
        }
      });
      guessResult = response.data
    } catch (error) {
      log.error("error occurred in http call to prediction API:");
      log.error(error.message);
      guessResult = null;
      retries--;
    }
  }

  player.processGuess(guessResult);

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
