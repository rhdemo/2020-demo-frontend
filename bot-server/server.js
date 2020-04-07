'use strict';
global.WebSocket = require('ws');
const log = require('./utils/log')('bot-server');
require('./datagrid/enable-logging');
const initGameData = require('./datagrid/init-game-data');
const pollDatagrid = require('./datagrid/poll-datagrid');
const initAdminMessaging = require('./messaging/init-admin-messaging');
const broadcastAdminStats = require("./messaging/broadcast/bot-stats");

global.game = {
  id: null,
  state: 'loading'
};
global.bots = [];
global.actionInterval = 0;
global.actionTimer = null;

setInterval(() => broadcastAdminStats(), 5000);

initGameData()
  .then(() => {
    pollDatagrid(5000);
    initAdminMessaging();
  });
