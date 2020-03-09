module.exports.INCOMING_MESSAGE_TYPES = {
  INIT: 'init',
  PING: 'ping',
  GUESS: 'guess',
  BONUS_GUESS: 'bonus-guess',
};

module.exports.OUTGOING_MESSAGE_TYPES = {
  ERROR: 'error',
  HEARTBEAT: 'heartbeat',
  PING_RESPONSE: 'pong',
  PLAYER_CONFIGURATION: 'player-configuration',
  GAME: 'game',
  GUESS_RESULT: 'guess-result'
};
