const log = require("../utils/log")("game-messaging");
const {CLUSTER_NAME, HOSTNAME} = require('../utils/constants');
const {INCOMING_AMQ_MESSAGE_TYPES} = require('./message-types');
const gameHandler = require('./game-handler');
const resetGameHandler = require('./reset-game-handler');

function gameMessageHandler(message) {
  log.debug('gameMessageHandler', message);
  const {body} = message;

  if (!body) {
    log.error('Malformed AMQ Message', message);
  }

  switch (body.type) {
    case INCOMING_AMQ_MESSAGE_TYPES.RESET_GAME:
      resetGameHandler(message);
      break;

    case INCOMING_AMQ_MESSAGE_TYPES.GAME:
      gameHandler(message);
      break;

    default:
      log.debug('Unprocessed AMQ Message', message);
      break;
  }
}

function initGameMessaging() {
  const container = require('rhea').create_container({enable_sasl_external: true});
  container.on('connection_open', function (context) {
    global.amqpReceiver = context.connection.open_receiver('mc/game');
    global.amqpSender = context.connection.open_sender('mc/game');
  });
  container.on('message', function (context) {
    gameMessageHandler(context.message);
  });
  container.once('sendable', function (context) {
    context.sender.send({
      body: {
        type: 'admin-edge-connect',
        data: {
          clusterName: CLUSTER_NAME,
          hostname: HOSTNAME,
          date: new Date().toISOString()
        }
      }
    });
  });
  container.connect();
}

module.exports = initGameMessaging;