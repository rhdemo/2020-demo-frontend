const log = require("../utils/log")("game-messaging");
const {CLUSTER_NAME, HOSTNAME} = require('../utils/constants');
const AMQ_MESSAGE_TYPES = require('./message-types');
const gameHandler = require('./handlers/game');
const resetGameHandler = require('./handlers/reset-game');

const options = 'mc/game';


function gameMessageHandler(message) {
  log.debug('gameMessageHandler', message);
  const {body} = message;

  if (!body) {
    log.error('Malformed AMQ Message', message);
  }

  const bodyObj = JSON.parse(body);

  switch (bodyObj.type) {
    case AMQ_MESSAGE_TYPES.GAME.RESET_GAME:
      resetGameHandler(bodyObj);
      break;

    case AMQ_MESSAGE_TYPES.GAME.GAME:
      gameHandler(bodyObj);
      break;

    case AMQ_MESSAGE_TYPES.GAME.CONNECT:
      log.trace('Message ignored: %o', bodyObj);
      break;

    default:
      log.info('Unprocessed AMQ Message', message);
      break;
  }
}

function initGameMessaging() {
  const container = require('rhea').create_container({enable_sasl_external: true});
  container.on('connection_open', function (context) {
    global.amqpReceiver = context.connection.open_receiver(options);
    global.amqpSender = context.connection.open_sender(options);
  });
  container.on('message', function (context) {
    gameMessageHandler(context.message);
  });
  container.once('sendable', function (context) {
    context.sender.send({
      body: JSON.stringify({
        type: AMQ_MESSAGE_TYPES.GAME.CONNECT,
        data: {
          clusterName: CLUSTER_NAME,
          hostname: HOSTNAME,
          date: new Date().toISOString()
        }
      })
    });
  });
  container.connect();
}

module.exports = initGameMessaging;