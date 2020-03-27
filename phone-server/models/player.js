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
    this.username = generateUsername();
    this.id = `${CLUSTER_NAME} - ${this.username}`;
    this.avatar = generateAvatar();
    this.gameId = global.game.id;
    this.creationServer = CLUSTER_NAME;
    this.gameServer = CLUSTER_NAME;
    // override generated values with input fields
    if (player) {
      Object.assign(this, player);
    }
  }

  get type() {
    return 'Player';
  }

  get dataClient() {
    return global.playerData;
  }

  get attributes() {
    return ['id', 'username', 'avatar', 'gameId', 'score', 'right', 'wrong', 'history', 'lastRound', 'currentRound', 'creationServer', 'gameServer', 'scoringServer'];
  }

  get related() {
    const game = global.game.toDict();
    return {game};
  }

  updateUserId() {
    this.id = `${CLUSTER_NAME} - ${this.username}`;
  }

  beforeSave() {
    super.beforeSave();
    if (!this.id) {
      this.updateUserId();
    }
  }
}

module.exports = Player;
