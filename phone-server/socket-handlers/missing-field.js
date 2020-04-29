const log = require('../utils/log')('socket-handlers/missing-fields');
const send = require('../utils/send');
const {OUTGOING_MESSAGE_TYPES} = require('./message-types');

function missingField(ws, messageObj, fieldName) {
  if (messageObj[fieldName] === undefined || messageObj[fieldName] === null ) {
    const message = `Ignoring incoming malformed guess data. Missing ${fieldName}`;
    log.warn(message);
    send(ws, JSON.stringify({type: OUTGOING_MESSAGE_TYPES.ERROR, requestId: messageObj.requestId, error: {message}}));
    return true
  }
  return false;
}


module.exports = missingField;
