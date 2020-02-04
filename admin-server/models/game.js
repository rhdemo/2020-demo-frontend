const uuidv4 = require("uuid/v4");
const GAME_STATES = require("./game-states");

class Game {
  constructor() {
    this.id = uuidv4();
    this.state = GAME_STATES.LOBBY;
  }
}

module.exports = Game;
