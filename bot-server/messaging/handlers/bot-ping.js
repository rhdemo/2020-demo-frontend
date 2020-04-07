const log = require('../../utils/log')('messaging/game-handler');
const broadcastBotStats = require('../broadcast/bot-stats');

async function resetStatsHandler(bodyObj) {
  log.trace('resetStatsHandler %o', bodyObj);
  broadcastBotStats();
}

module.exports = resetStatsHandler;
