const log = require('../utils/log')('socket-handlers/guess');
const axios = require('../utils/axios');
const {CLUSTER_NAME} = require('../utils/constants');
const {SCORING_URL} = require('../utils/constants');
const extractCurrentRound = require('./extract-current-round');


async function updateScore(player, number, source, destination) {
  let updatedPlayer = null;
  let tries = 0;



  while (!updatedPlayer && tries < 3) {
    updatedPlayer = await callScoringService(player, number, source, destination);
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

async function callScoringService(player, number, source, destination) {
  const startTime = new Date();

  try {
    player.gameServer = CLUSTER_NAME;
    const requestInfo = {
      timeout: 1000,
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
      url: new URL('/game/score', SCORING_URL).href,
      data: {
        game: global.game,
        player: player.toScoringFormat(),
        score: player.score,
        currentRound: calculateScoringCurrentRound(player, number, source, destination)
      }
    };

    const response = await axios(requestInfo);
    player.score = response.data.score;
    updatePlayerCurrentRound(player, number, source, destination, response.data);
  } catch (error) {
    log.error('error occurred in http call to scoring API:');
    log.error(error.message);
  }

  const endTime = new Date();
  const timeDiff = endTime - startTime;

  if (timeDiff > 300) {
    log.warn(`Scoring service request took ${timeDiff} ms`);
  }

  return player;
}

function calculateScoringCurrentRound(player, number, source, destination) {
  let choices = player.currentRound.choices.map(x => x === null ?  'correct' : x);

  if (Number.isInteger(source)) {
    choices[source] = 'guess';
  }

  let guess = player.currentRound.answers.map(a => {
      if (a.result === 'correct') {
        return a.number;
      }

      if (a.format === 'decimal') {
        return '.';
      }

      return '';
  });

  if (Number.isInteger(number) && Number.isInteger(destination)) {
    guess[destination] = number;
  }

  return {
    id: player.currentRound.id,
    version: player.currentRound.version,
    pointsAvailable: player.currentRound.pointsAvailable,
    guess,
    choices
  };
}

function updatePlayerCurrentRound(player, number, source, destination, ssData) {
  if (player.currentRound.id === ssData.currentRound.id) {
    mergeCurrentRound(player, number, source, destination, ssData);
  } else {
    changeNewRound(player, number, source, destination, ssData)
  }
}

function mergeCurrentRound(player, number, source, destination, ssData) {
  player.currentRound.pointsAvailable = ssData.currentRound.pointsAvailable;
  player.currentRound.choices = ssData.currentRound.choices.map(x => x === 'correct' ?  null : x);
  player.currentRound.answers[destination].number = number;
  player.currentRound.answers[destination].from = source;

  let historyRecord = player.history[player.history.length-1];
  if (ssData.score.status === 'BAD_GUESS') {
    player.currentRound.answers[destination].result = 'incorrect';
    historyRecord.wrong += 1;
  } else {
    historyRecord.right += 1;
    player.currentRound.answers[destination].result = 'correct';
  }
}

function changeNewRound(player, number, source, destination, ssData) {
  let historyRecord = player.history[player.history.length-1];
  historyRecord.right += 1;
  historyRecord.points = player.currentRound.pointsAvailable;

  player.currentRound = extractCurrentRound(ssData);
  player.history.push({
    itemId: ssData.currentRound.id,
    itemName: ssData.currentRound.name,
    right: 0,
    wrong: 0,
    points: null
  });
}


module.exports = updateScore;
