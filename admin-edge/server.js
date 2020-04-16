'use strict';

require("./datagrid/enable-logging");
const initGameData = require('./datagrid/init-game-data');
const initPlayerData = require('./datagrid/init-player-data');
const pollDatagrid = require("./datagrid/poll-datagrid");
const initGameMessaging = require('./messaging/init-game-messaging');
const initAdminMessaging = require('./messaging/init-admin-messaging');

global.game = {
  id: null,
  state: "loading"
};
global.playerStats = null;
global.gameData = null;
global.playerData = null;

initGameData()
  .then(() => initPlayerData())
  .then(() => {
    pollDatagrid(5000);
    initGameMessaging();
    initAdminMessaging();
  });


