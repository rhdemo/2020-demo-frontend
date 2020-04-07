const readBotConfig = require("../read-bot-config");
const broadcastAdminStats = require("../../messaging/broadcast/bot-stats");

async function botConfigHandler(client, changeType, key) {
  await readBotConfig();
  broadcastAdminStats();
}

module.exports = botConfigHandler;
