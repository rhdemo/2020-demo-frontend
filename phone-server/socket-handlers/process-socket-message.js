const log = require('../utils/log')('global-socket-handler');


const {INCOMING_MESSAGE_TYPES, OUTGOING_MESSAGE_TYPES} = require('./message-types');

function processSocketMessage(conn, messageStr) {
  let messageObj;

  try {
    messageObj = JSON.parse(messageStr);
  } catch (error) {
    log.error('Malformed socket message JSON:', error.message);
    return;
  }

  switch (messageObj.type) {
    case INCOMING_MESSAGE_TYPES.INIT:
      initHandler(conn, messageObj);
      break;

    case INCOMING_MESSAGE_TYPES.PING:
      pingHandler(conn, messageObj);
      break;

    case INCOMING_MESSAGE_TYPES.GUESS:
      guessHandler(conn, messageObj);
      break;

    case INCOMING_MESSAGE_TYPES.BONUS_GUESS:
      bonusGuessHandler(conn, messageObj);
      break;

    default:
      log.warn(`Unhandled Game Message of type '${messageStr}'`);
      break;
  }
}

/**
 * Wraps a message handler with some generic logging
 * @param {Function} fn The handler function implementation
 * @param {String} type The named type of the payload
 */
function wrapMessageHandler (type, fn) {
    return function messageHandlerWrapper (ws, messageObj) {
        log.info(`processing message of type ${type} for player ${messageObj.playerKey}`);
        log.trace(`payload for message '${type}' was: %j`, messageObj);

        fn(ws, messageObj)
    }
}

const initHandler = wrapMessageHandler(INCOMING_MESSAGE_TYPES.INIT, require('./init'));
const guessHandler = wrapMessageHandler(INCOMING_MESSAGE_TYPES.GUESS, require('./guess'));
const bonusGuessHandler = wrapMessageHandler(INCOMING_MESSAGE_TYPES.BONUS_GUESS, require('./bonus-guess'));
const pingHandler = wrapMessageHandler(INCOMING_MESSAGE_TYPES.PING, function (ws, messageObj) {
  ws.send(JSON.stringify({type: OUTGOING_MESSAGE_TYPES.PING_RESPONSE}));
});


module.exports = processSocketMessage;
