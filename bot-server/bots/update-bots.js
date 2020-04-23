const log = require('../utils/log')('bots/update-bots');
const Bot = require('./bot');

function updateBots() {
  log.info('udpateBots numBots = ', global.numBots);
  if (global.numBots > global.bots.length) {
    for (let i = global.bots.length; i < global.numBots; i++) {
      global.bots[i] = new Bot(i);
    }
  } else if (global.numBots < global.bots.length) {
    while (global.bots.length > global.numBots) {
      let b = global.bots.pop();
      b.stop();
    }
  }
  log.info('update numBots = %d, bots.length = %d', global.numBots, global.bots.length);
}

module.exports = updateBots;