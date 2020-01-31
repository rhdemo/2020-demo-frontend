const WebSocket = require("ws");
const log = require("../utils/log")("datagrid/game");
const send = require("../utils/send");
const Configuration = require("../models/configuration");
const readGame = require("./read-game");
const connectPlayer = require("../socket-handlers/init");

async function gameHandler(client, changeType, key) {
  log.info("Game change");

  const originalId = global.game ? global.game.id : null;
  await readGame();

  if (originalId !== global.game.id) {
    refreshConnections();
  } else {
    sendGameConfigs();
  }
}

function refreshConnections() {
  global.players = {};

  if (global.socketServer.clients) {
    global.socketServer.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        connectPlayer(client, {})
      }
    });
  }
}

async function sendGameConfigs() {
  for (let idKey in global.players) {
    sendPlayerConfig(idKey);
  }
}


async function sendPlayerConfig(playerId) {
  let player = global.players[playerId];
  const ws = player.ws;
  player = await getPlayer(playerId);
  let configuration = new Configuration(player);
  send(ws, JSON.stringify(configuration));
}

async function getPlayer(id) {
  let player = null;

  try {
    let playerStr = await global.playerClient.get(id);

    if (playerStr) {
      player = JSON.parse(playerStr);
    } else {
      log.error(`Player ${id} data not found`);
      return null;
    }
  } catch (error) {
    log.error("error occurred getting player data:", error.message);
  }

  return player;
}

module.exports = gameHandler;

