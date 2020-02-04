const {DATAGRID_KEYS} = require("../datagrid/constants");

async function gameHandler(ws, messageObj) {
  let gameStr;
  let originalGame;
  try {
    gameStr = await global.dataClient.get(DATAGRID_KEYS.GAME);
  } catch (error) {
    log.error("Failed to read game. Error:", error.message);
    return;
  }

  if (gameStr) {
    originalGame = JSON.parse(gameStr);
  }
  let modifiedGame = {...originalGame, ...messageObj.game};


  try {
    let result = await global.dataClient.put(DATAGRID_KEYS.GAME, JSON.stringify(modifiedGame));
    return result;
  } catch (error) {
    log.error("Failed to update game. Error:", error.message);
    return;
  }
}

module.exports = gameHandler;

