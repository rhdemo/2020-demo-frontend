const lodashGet = require('lodash/get');
const log = require('../../utils/log')('bot-ping-socket-handler');
const {CLUSTER_NAME, HOSTNAME} = require('../../utils/constants');
const AMQ_MESSAGE_TYPES = require('../message-types');

function adminStats(ws, messageObj) {
  log.trace('broadcastAdminStats');
  const players = lodashGet(global, 'playerStats.globalCurrentNumberOfEntries')
  try {
    global.amqpAdminSender.send({
      content_type: "application/json",
      body: JSON.stringify({
        type: AMQ_MESSAGE_TYPES.ADMIN.EDGE_STATS,
        data: {
          clusterName: CLUSTER_NAME,
          hostname: HOSTNAME,
          date: new Date().toISOString(),
          game: global.game,
          players
        }
      })
    });
  } catch (error) {
    log.error('error occurred in sending game update');
    log.error(error);
  }
}

module.exports = adminStats;
