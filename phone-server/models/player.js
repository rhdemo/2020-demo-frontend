const Model = require('./model');
const generateUsername = require('./username/generate-username');
const itemData = require('./item-data');

class Player extends Model {
  static get dataClient() {
    return global.playerData;
  }

  constructor() {
    super();
    this.username = generateUsername();
    this.avatar = {};
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
      choices: item.choices,
      answers: item.answers,
      image: item.image,
      points: 100
    };
  }

  addGuess(guess) {
    //TODO persist guess
    this._updateAnswers(guess);
    this._scoreCurrentRound();
  }

  _updateAnswers(guess) {
    let item = itemData[this.currentRound.itemId];
    console.log('updateCurrentRound', item);
    this.currentRound.answers.forEach((currentAnswer, index) => {
      if (currentAnswer.format !== "number" || currentAnswer.result === "correct") {
        return; // skip, no need to answer
      }

      const guessAnswer = guess.answers[index];
      if ((guessAnswer.result && guessAnswer.result !== "pending") || !Number.isInteger(guessAnswer.number)) {
        return; // skip, no attempt to answer
      }

      currentAnswer.number = guessAnswer.number;
      currentAnswer.from = guessAnswer.from;
      if (currentAnswer.number === item.price[index]) {
        currentAnswer.result = "correct";
        this.currentRound.choices[guessAnswer.from] = null;
      } else {
        currentAnswer.result = "incorrect";
        this.currentRound.points = this.currentRound.points - 5;
        if (currentAnswer.points < 0) {
          currentAnswer.points = 0;
        }
        this.currentRound.choices[guessAnswer.from] = item.choices[guessAnswer.from];
      }
    });
  }

  _scoreCurrentRound() {
    let currentRoundCorrect = true;
    for (let i = 0; i < this.currentRound.answers.length; i++) {
      let a = this.currentRound.answers[i];
      if (a.format === 'number' && a.result !== 'correct') {
        currentRoundCorrect = false;
      }
    }

    if (currentRoundCorrect) {
      this.lastRound = this.currentRound;
      this.score = this.score + this.lastRound.points;
      let nextItemId = this.lastRound.itemId + 1;
      if (nextItemId >= itemData.length) {
        nextItemId = 0;
      }
      this.initCurrentRound(nextItemId);
    }
  }
}

module.exports = Player;
