const log = require('../../utils/log')('messaging/game-handler');
const broadcastAdminStats = require('../broadcast/admin-stats');

async function resetStatsHandler(bodyObj) {
  log.trace('resetStatsHandler %o', bodyObj);
  broadcastAdminStats();
}

module.exports = resetStatsHandler;
