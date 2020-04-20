const WebSocket = require("ws");
const log = require("../utils/log")("datagrid/game");
const send = require("../utils/send");
const Player = require("../models/player");
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


async function sendPlayerConfig(playerKey) {
  let player = global.players[playerKey];
  const ws = player.ws;
  try {
    let player = await Player.find(playerKey);

    if (!player) {
      log.error(`Player ${playerKey} data not found`);
      return;
    }

    let configuration = new Configuration(player);
    send(ws, JSON.stringify(configuration));
  } catch (error) {
    log.error("error occurred getting player data:", error.message);
  }
}


module.exports = gameHandler;

