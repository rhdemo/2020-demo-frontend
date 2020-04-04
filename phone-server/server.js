'use strict';
const log = require('./utils/log')('phone-server');
const WebSocket = require("ws");

const broadcast = require('./utils/broadcast');
const processSocketMessage = require('./socket-handlers/process-socket-message');
const {OUTGOING_MESSAGE_TYPES} = require('./socket-handlers/message-types');

require('./datagrid/enable-logging');
const initGameData = require('./datagrid/init-game-data');
const initPlayerData = require('./datagrid/init-player-data');
const pollDatagrid = require('./datagrid/poll-datagrid');
const pollServiceStatus = require('./utils/poll-service-status');

const {PORT, IP} = require('./utils/constants');

global.game = {
  id: null,
  state: 'loading'
};
global.players = {};

global.socketServer = new WebSocket.Server({
  host: IP,
  port: PORT
});

setInterval(function () {
  broadcast(JSON.stringify({
    type: OUTGOING_MESSAGE_TYPES.HEARTBEAT,
    game: global.game,
    leaderboard: []
  }));
}, 3000);

pollServiceStatus(5000);

initGameData()
  .then(() => initPlayerData())
  .then(() => {
    global.socketServer.on('connection', function connection(ws) {
      ws.on('message', function incoming(message) {
        processSocketMessage(ws, message);
      });
    });
    pollDatagrid(5000);
  });
