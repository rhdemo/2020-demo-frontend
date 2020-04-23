const lodashGet = require('lodash/get');
const log = require("../utils/log")("datagrid/read-bot-config");
const {GAME_DATA_KEYS} = require("./game-constants");
const {CLUSTER_NAME} = require('../utils/constants');
const triggerBotActions = require('../bots/trigger-actions')
const updateBots = require('../bots/update-bots')


async function readBotConfig() {
  try {
    let str = await global.gameData.get(GAME_DATA_KEYS.BOT_CONFIG);
    if (str) {
      global.botConfig = JSON.parse(str);
      setBots();
      setActionInterval()
    } else {
      log.error("Bot configuration missing");
    }
    return global.botConfig;
  } catch (error) {
    log.error("Failed to read botConfig. Error:", error.message);
  }
}

function setBots() {
  let numBots = lodashGet(global.botConfig, `${CLUSTER_NAME}.bots`) || 0;
  if (numBots > 0) {
    global.numBots = numBots;
  } else {
    global.numBots = 0;
  }
  if (global.actionInterval <= 0) {
    updateBots();
  }
}

function setActionInterval() {
  let interval = lodashGet(global.botConfig, `${CLUSTER_NAME}.interval`);
  if (!Number.isInteger(interval)) {
    interval = 0;
  }
  let actionInterval = interval * 1000;
  if (actionInterval !== global.actionInterval) {
    if (global.actionTimer) {
      clearInterval(global.actionTimer);
    }
    if (actionInterval > 0) {
      global.actionInterval = actionInterval;
      global.actionTimer = setInterval(() => triggerBotActions(), global.actionInterval)
    } else {
      global.actionInterval = 0;
      updateBots();
    }
  }
}

module.exports = readBotConfig;
