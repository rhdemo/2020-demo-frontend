const {OUTGOING_MESSAGE_TYPES} = require("../socket-handlers/message-types");
const {CLUSTER_NAME} = require('../utils/constants');

class Configuration {
  constructor(player) {
    this.type = OUTGOING_MESSAGE_TYPES.PLAYER_CONFIGURATION;
    this.player = player.toDict();
    this.player.gameServer = CLUSTER_NAME;
    this.game = global.game;
  }
}

module.exports = Configuration;
