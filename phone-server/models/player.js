const Model = require('./model');
const generateUsername = require('./username/generate-username');
const generateAvatar = require('./generate-avatar');
const itemData = require('./item-data');

class Player extends Model {
  static get dataClient() {
    return global.playerData;
  }

  constructor() {
    super();
    this.username = generateUsername();
    this.avatar = generateAvatar();
    this.gameId = global.game.id;
    this.score = 0;
    this.lastRound = null;
    this.initCurrentRound(0);
  }

  get dataClient() {
    return global.playerData;
  }

  get attributes() {
    return ['id', 'username', 'avatar', 'gameId', 'score', 'lastRound', 'currentRound'];
  }

  get related() {
    const game = global.game.toDict();
    return {game};
  }

  beforeSave() {
    super.beforeSave();
    this.id = this.username;
  }

  initCurrentRound(index) {
    const item = itemData[index];
    this.currentRound = {
      itemId: item.id,
      choices: [...item.choices],
      answers: [...item.answers],
      image: item.image,
      points: 100
    };
  }

  processGuess(guessResult) {
    if (!guessResult) {
      return;
    }
    let item = itemData[this.currentRound.itemId];
    this.currentRound.answers = guessResult.answers;
    this.currentRound.choices = [...item.choices];
    this.currentRound.answers.forEach((currentAnswer, index) => {
      if (currentAnswer.result === 'correct') {
        this.currentRound.choices[currentAnswer.from] = null;
      }
    });

    this.currentRound.points = guessResult.pointsAvailable;
    this.score += guessResult.points;

    if (guessResult.correct) {
      this.lastRound = this.currentRound;
      let nextItemId = this.lastRound.itemId + 1;
      if (nextItemId >= itemData.length) {
        nextItemId = 0;
      }
      this.initCurrentRound(nextItemId);
    }
  }
}

module.exports = Player;
