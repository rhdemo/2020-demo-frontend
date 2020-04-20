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
    this.id = uuidv4();
    this._key = `${CLUSTER_NAME} - ${this.username}`;
    this.avatar = generateAvatar();
    this.gameId = global.game.id;
    this.creationServer = CLUSTER_NAME;
    this.gameServer = CLUSTER_NAME;
    this.history = [];
    // override generated values with input fields
    if (player) {
      Object.assign(this, player);
    }
  }

  get key() {
    return this._key;
  }

  set key(newKey) {
    return this._key = newKey;
  }

  get type() {
    return 'Player';
  }

  get dataClient() {
    return global.playerData;
  }

  get attributes() {
    return ['id', 'key', 'username', 'avatar', 'gameId', 'score', 'right', 'wrong', 'history', 'lastRound', 'currentRound', 'creationServer', 'gameServer', 'scoringServer'];
  }

  get related() {
    const game = global.game.toDict();
    return {game};
  }

  updatePlayerKey() {
    this._key = `${CLUSTER_NAME} - ${this.username}`;
  }

  beforeSave() {
    super.beforeSave();
    if (!this.key) {
      this.updatePlayerKey();
    }
  }

  toScoringFormat() {
    return {
      id: this.id,
      username: this.username,
      creationServer: this.creationServer,
      gameServer: this.gameServer,
      avatar: this.avatar
    }
  }
}

module.exports = Player;
