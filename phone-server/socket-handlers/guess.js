const log = require('../utils/log')('socket-handlers/guess');
const send = require('../utils/send');
const axios = require('../utils/axios');
const {CLUSTER_NAME} = require('../utils/constants');
const {SCORING_URL} = require('../utils/constants');
const {GAME_STATES} = require('../models/constants');
const Player = require('../models/player');
const Configuration = require('../models/configuration');

async function guessHandler(ws, messageObj) {
  log.debug('guessHandler', messageObj);
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
  }

  player = new Player(guessResult.player);

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
