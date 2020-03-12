const log = require('../utils/log')('global-socket-handler');

function global(conn, messageStr) {
  let messageObj;

  try {
    messageObj = JSON.parse(messageStr);
  } catch (error) {
    log.error('Malformed socket message JSON:', error.message);
    return;
  }

  switch (messageObj.type) {
    default:
      log.warn(`Unhandled Game Message of type '${messageStr}'`);
      break;
  }
}


const handle = (connection) => {
  connection.socket.on('message', message => {
    global(connection.socket, message);
  })
};

module.exports = handle;