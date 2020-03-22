'use strict';

const WebSocket = require("ws");
const path = require('path');
const log = require('./utils/log')('phone-server');
const broadcast = require('./utils/broadcast');
const processSocketMessage = require('./socket-handlers/process-socket-message');
const {OUTGOING_MESSAGE_TYPES} = require('./socket-handlers/message-types');

const opts = {};
const {PORT, IP, LOG_LEVEL} = require('./utils/constants');
const wsOpts = {
  maxPayload: 100 * 1024 * 1024 // 100mb
};

global.game = {
  id: null,
  state: "loading"
};

global.socketServer = new WebSocket.Server({
  host: IP,
  port: PORT
});


log.info(`Started Game server on ${IP}:${PORT}`);

setInterval(function () {
  broadcast(OUTGOING_MESSAGE_TYPES.HEARTBEAT);
}, 5000);


global.socketServer.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    processSocketMessage(ws, message);
  });
});
