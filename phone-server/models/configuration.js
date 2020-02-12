const {OUTGOING_MESSAGE_TYPES} = require("../socket-handlers/message-types");

class Configuration {
  constructor(player) {
    this.type = OUTGOING_MESSAGE_TYPES.PLAYER_CONFIGURATION;
    this.player = player.toDict();
    this.game = global.game;
  }
}

module.exports = Configuration;
