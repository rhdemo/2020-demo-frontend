const { v4: uuidv4 } = require('uuid');
const {CLUSTER_NAME} = require('../utils/constants');
const Model = require('./model');
const generateUsername = require('./username/generate-username');
const generateAvatar = require('./generate-avatar');

class Player extends Model {
  static get dataClient() {
    return global.playerData;
  }

  constructor(player) {
    super(player);
    this.id = uuidv4();
    this.username = generateUsername();
    this.avatar = generateAvatar();
    this.gameId = global.game.id;
    this.creationServer = CLUSTER_NAME;
    this.gameServer = CLUSTER_NAME;
    // override generated values with input fields
    if (player) {
      Object.assign(this, player);
    }
  }

  get dataClient() {
    return global.playerData;
  }

  get attributes() {
    return ['id', 'username', 'avatar', 'gameId', 'score', 'right', 'wrong', 'lastRound', 'currentRound', 'creationServer', 'gameServer', 'scoringServer'];
  }

  get related() {
    const game = global.game.toDict();
    return {game};
  }

  beforeSave() {
    super.beforeSave();
    this.id = this.username;
  }
}

module.exports = Player;
