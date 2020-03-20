const log = require('../utils/log')('socket-handlers/guess');
const axios = require('../utils/axios');
const {CLUSTER_NAME} = require('../utils/constants');
const {SCORING_URL} = require('../utils/constants');
const Player = require('../models/player');

async function updateScore(player, answers) {
  let updatedPlayer = null;
  let tries = 0;
  while (!updatedPlayer && tries < 3) {
    updatedPlayer = await callScoringService(player, answers);
    tries++;
  }

  if (updatedPlayer) {
    player = updatedPlayer;
  } else {
    log.error(`Failed to update player score ${player.id}`);
    return null;
  }

  try {
    await updatedPlayer.save();
  } catch (error) {
    log.error(`Player ${player.id} data not saved`);
    return updatedPlayer;
  }

  return updatedPlayer;
}

async function callScoringService(player, answers) {
  const startTime = new Date();
  let updatedPlayer = null;

  try {
    player.gameServer = CLUSTER_NAME;
    const requestInfo = {
      timeout: 1000,
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
    updatedPlayer = new Player(response.data.player)
  } catch (error) {
    log.error("error occurred in http call to scoring API:");
    log.error(error.message);
  }

  const endTime = new Date();
  const timeDiff = endTime - startTime;

  if (timeDiff > 300) {
    log.warn(`Scoring service request took ${timeDiff} ms`);
  }

  return updatedPlayer;
}

module.exports = updateScore;
