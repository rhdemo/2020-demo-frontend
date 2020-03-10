const log = require('../utils/log')('socket-handlers/guess');
const axios = require('../utils/axios');
const {CLUSTER_NAME} = require('../utils/constants');
const {SCORING_URL} = require('../utils/constants');
const Player = require('../models/player');

async function updateScore(player, answers) {
  let guessResult = null;
  try {
    player.gameServer = CLUSTER_NAME;
    const requestInfo = {
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      url: new URL("/scores", SCORING_URL).href,
      data: {
        game: global.game,
        player: player.toDict(),
        answers
      }
    };

    const response = await axios(requestInfo);
    guessResult = response.data;
    log.debug(guessResult);
  } catch (error) {
    log.error("error occurred in http call to scoring API:");
    log.error(error.message);
    guessResult = null;
    return null;
  }

  let updatedPLayer = new Player(guessResult.player);

  try {
    await updatedPLayer.save();
  } catch (error) {
    log.error(`Player ${player.id} data not saved`);
    return null;
  }

  return updatedPLayer;
}

module.exports = updateScore;
