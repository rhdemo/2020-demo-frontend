const log = require('../utils/log')('socket-handlers/guess');
const axios = require('../utils/axios');
const {CLUSTER_NAME} = require('../utils/constants');
const {SCORING_URL} = require('../utils/constants');

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

  try {
    player.gameServer = CLUSTER_NAME;
    const requestInfo = {
      timeout: 1000,
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      url: new URL("/game/score", SCORING_URL).href,
      data: {
        game: global.game,
        player: player.toScoringFormat(),
        score: player.score,
        currentRound: calculateScoringCurrentRound(player, answers)
      }
    };

    const response = await axios(requestInfo);
    player.score = response.data.score;
    updatePlayerCurrentRound(player, answers, response.data);
  } catch (error) {
    log.error("error occurred in http call to scoring API:");
    log.error(error.message);
  }

  const endTime = new Date();
  const timeDiff = endTime - startTime;

  if (timeDiff > 300) {
    log.warn(`Scoring service request took ${timeDiff} ms`);
  }

  return player;
}

function calculateScoringCurrentRound(player, guessAnswers) {
  let choices = player.currentRound.choices.map(x => x === null ?  'correct' : x);

  guessAnswers.forEach(a => {
    if (a.format === 'number' && !a.result && Number.isInteger(a.from)) {
      choices[a.from] = 'guess';
    }
  });

  let guess = guessAnswers.map((guessAnswer, idx) => {
    //incorrect answers from frontend missing 'incorrect' result
    let a = {...player.currentRound.answers[idx], ...guessAnswer};

    if (guessAnswer.format === 'decimal') {
      return '.';
    }
    if (Number.isInteger(a.number) && (!a.result || a.result === 'correct')) {
      return guessAnswer.number;
    }
    return '';
  });

  return {
    id: player.currentRound.id,
    version: player.currentRound.version,
    pointsAvailable: player.currentRound.pointsAvailable,
    guess,
    choices
  };
}

function updatePlayerCurrentRound(player, guessAnswers, ssData) {
  if (player.currentRound.id === ssData.currentRound.id) {
    mergeCurrentRound(player, guessAnswers, ssData);
  } else {
    changeNewRound(player, guessAnswers, ssData)
  }
}

function mergeCurrentRound(player, guessAnswers, ssData) {
  player.currentRound.pointsAvailable = ssData.currentRound.pointsAvailable;
  player.currentRound.choices = ssData.currentRound.choices.map(x => x === 'correct' ?  null : x);
  player.currentRound.answers.forEach((a, idx) => {
    Object.assign(a, guessAnswers[idx]);
    if (a.format === 'number' && Number.isInteger(a.number)) {
      a.result = Number.isInteger(ssData.currentRound.guess[idx]) ? 'correct' : 'incorrect';
    }
  });

  let historyRecord = player.history[player.history.length-1];
  if (ssData.score.status === 'BAD_GUESS') {
    historyRecord.wrong += 1;
  } else {
    historyRecord.right += 1;
  }
}

function changeNewRound(player, guessAnswers, ssData) {
  let historyRecord = player.history[player.history.length-1];
  historyRecord.right += 1;
  historyRecord.points = player.currentRound.pointsAvailable;

  player.lastRound = player.currentRound;
  player.lastRound.answers.forEach((a, idx) => {
    Object.assign(a, guessAnswers[idx]);
    if (a.format === 'number') {
      a.result = 'correct';
    }
  });

  player.currentRound = ssData.currentRound;
  player.history.push({
    itemId: ssData.currentRound.id,
    itemName: ssData.currentRound.name,
    right: 0,
    wrong: 0,
    points: null
  });
}


module.exports = updateScore;
