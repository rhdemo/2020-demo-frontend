const log = require('../utils/log')('socket-handlers/init');
const send = require('../utils/send');
const axios = require('../utils/axios');
const {SCORING_URL} = require('../utils/constants');
const Player = require('../models/player');
const Configuration = require('../models/configuration');
const generateUsername = require('../models/username/generate-username');

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
    player = await getExistingPlayer(ws, playerId)
  } else {
    let username = await generateUniqueUsername();
    player = await createNewPlayer(ws, username);
  }

  global.players[player.key] = {...player, ws};
  return player;
}

async function getExistingPlayer(ws, playerId) {
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

async function createNewPlayer(ws, username) {
  let player = new Player();
  player.username = username;
  log.debug('createNewPlayer', username, player);

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

  try {
    await player.save();
  } catch (error) {
    log.error('error occurred saving new player data: ', error.message);
  }

  return player;
}

async function generateUniqueUsername() {
  let i = 0;
  let username = null;
  while (i < 100) {
    username = generateUsername();
    try {
      let playerStr = await Player.find(username);
      if (!playerStr) {
        return username;
      }
    } catch (error) {
      log.error('error occurred retrieving player data: ', error.message);
    } finally {
      i++;
    }
  }

  username += ' ' + Math.random().toString(36).substring(2);
  return username;
}

module.exports = initHandler;
