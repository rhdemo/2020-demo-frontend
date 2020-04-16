const log = require('../../utils/log')('bot-ping-socket-handler');
const {CLUSTER_NAME, HOSTNAME} = require('../../utils/constants');
const AMQ_MESSAGE_TYPES = require('../message-types');

function botStats(ws, messageObj) {
  log.trace('broadcastBotStats');
  const bots = global.bots.length;
  try {
    global.amqpAdminSender.send({
      content_type: "application/json",
      body: JSON.stringify({
        type: AMQ_MESSAGE_TYPES.ADMIN.BOT_STATS,
        data: {
          clusterName: CLUSTER_NAME,
          hostname: HOSTNAME,
          date: new Date().toISOString(),
          bots
        }
      })
    });
  } catch (error) {
    log.error('error occurred in sending game update');
    log.error(error);
  }
}

module.exports = botStats;
