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
    return player;  //revert on error
  }

  let updatedPlayer = new Player(guessResult.player);

  try {
    await updatedPlayer.save();
  } catch (error) {
    log.error(`Player ${player.id} data not saved`);
    return updatedPlayer;
  }

  return updatedPlayer;
}

module.exports = updateScore;
