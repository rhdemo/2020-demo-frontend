const env = require("env-var");
const log = require("../utils/log")("socket-handlers/init");
const {OUTGOING_MESSAGE_TYPES} = require("../socket-handlers/message-types");

async function initHandler(ws, messageObj) {
  ws.send(JSON.stringify({type: OUTGOING_MESSAGE_TYPES.GAME, data: global.game, action: "modify"}));
}

module.exports = initHandler;
