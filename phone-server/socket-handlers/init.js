const log = require('../utils/log')('socket-handlers/init');
const send = require('../utils/send');
const axios = require('../utils/axios');
const {SCORING_URL} = require('../utils/constants');
const Player = require('../models/player');
const Configuration = require('../models/configuration');

async function initHandler(ws, messageObj) {
  log.debug('initHandler', messageObj);
  let player = await initPlayer(ws, messageObj.playerId, messageObj.gameId);
  let configuration = new Configuration(player);
  log.debug(configuration);
  send(ws, JSON.stringify(configuration));
  return player;
}

async function initPlayer(ws, playerId, gameId) {
  log.debug('initPlayer', playerId, gameId);
  let player;

  //combination of playerId + gameId should be unique
  if (playerId && gameId === global.game.id) {
    player = await getExistingPlayer(playerId)
  } else {
    player = await createNewPlayer();
  }

  global.players[player.key] = {...player, ws};
  return player;
}

async function getExistingPlayer(playerId) {
  let player;
  try {
    player = await Player.find(playerId);
  } catch (error) {
    log.error(`error occurred retrieving existing player ${playerId}.  Error:`, error.message);
  }

  if (!player) {
    return createNewPlayer(ws, playerId);
  }

  return player;
}

async function createNewPlayer() {
  let player;

  try {
    player = await generateUniquePlayer();
  } catch (error) {
    log.error("error generating Unique Player");
    log.error(error);
  }

  const startTime = new Date();

  try {
    const requestInfo = {
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      url: new URL("/scores", SCORING_URL).href,
      data: {
        game: global.game,
        player: player.toDict(),
        answers: null
      }
    };

    const response = await axios(requestInfo);
    log.debug(response);
    player = new Player(response.data.player);
  } catch (error) {
    log.error("error occurred in http call to scoring API:");
    log.error(error.message);
  }

  const endTime = new Date();
  const timeDiff = endTime - startTime;

  if (timeDiff > 300) {
    log.warn(`Scoring service request took ${timeDiff} ms`);
  }

  try {
    await player.save();
  } catch (error) {
    log.error('error occurred saving new player data: ', error.message);
  }

  return player;
}

async function generateUniquePlayer() {
  let unique = false;
  let player = new Player();
  try {
    let playerStr = await Player.find(player.key);
    if (!playerStr) {
      unique = true;
    }
  } catch (error) {
    log.error('error occurred retrieving player data: ', error.message);
  }

  if (!unique) {
    player.username += ' ' + Math.random().toString(36).substring(8);
    player.updateUserId();
  }

  try {
    await player.save();
  } catch (error) {
    log.error('error occurred saving new player data: ', error.message);
  }

  return player;
}

module.exports = initHandler;
