const log = require('../utils/log')('bots/trigger-actions');
const updateBots = require('./update-bots');

function triggerActions() {
  updateBots();
  if (global.actionInterval <= 0 || global.bots.length <= 0) {
    return;
  }
  log.info('triggerBotActions %s bots', global.bots.length);
  global.bots.forEach((bot, idx) => {
    let delay = Math.floor((global.actionInterval / global.bots.length) * idx);
    bot.performDelayedAction(delay);
  });
}

module.exports = triggerActions;