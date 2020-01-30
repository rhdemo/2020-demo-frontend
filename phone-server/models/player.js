class Player {
  constructor(id) {
    this.id = id;
    this.username = this.id;
    this.gameId = global.game.id;
    this.score = 0;
  }
}

module.exports = Player;
