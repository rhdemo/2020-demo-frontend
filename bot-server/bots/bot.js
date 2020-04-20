const Sockette = require('sockette');
const lodashGet = require('lodash/get');
const { v4: uuidv4 } = require('uuid');
const log = require('../utils/log')('bots/bot');
const {GAME_SOCKET} = require('../utils/constants');
const {INCOMING_MESSAGE_TYPES, OUTGOING_MESSAGE_TYPES} = require('./message-types')
const numberImages = require('./number-images')

const maxWaitTries = 3;

class Bot {
  constructor(id) {
    this.id = id;
    this.actionTimer = null;
    this.state = 'disconnected';
    this.socket = null;
    this.socketStatus = null;
    this.data = {};
    this.waitTries = 0;
  }

  connect() {
    log.trace('connect()', this.id, this.state);
    this.state = 'connecting'
    this.socket = new Sockette(GAME_SOCKET, {
      timeout: 2000,
      onopen: this.onWsOpen,
      onmessage: this.onWsMessage,
      onreconnect: this.onWsOpen,
      onmaximum: this.onWsMaximum,
      onclose: this.onWsClosed,
      onerror: this.onWsError
    });
  }

  onWsOpen = (event) => {
    log.trace('bot.onWsOpen %o', this.id)
    this.state = 'connecting';
    this.socketStatus = 'connected';
    let messageObj = {
      type: OUTGOING_MESSAGE_TYPES.INIT,
      playerId: lodashGet(this.data, 'player.id'),
      gameId: lodashGet(this.data, 'game.id'),
      bot: true
    }
    this.socket.send(JSON.stringify(messageObj))
  };

  initPlayer() {
    let messageObj = {
      type: OUTGOING_MESSAGE_TYPES.INIT,
      playerId: lodashGet(this.data, 'player.id'),
      gameId: lodashGet(this.data, 'game.id'),
      bot: true
    }
    this.socket.send(JSON.stringify(messageObj))
  }

  onWsMessage = (event) => {
    const data = JSON.parse(event.data);
    switch (data.type) {
      case INCOMING_MESSAGE_TYPES.PLAYER_CONFIGURATION:
        this.waitTries = 0;
        this.state = 'connected';
        this.data.player = data.player;
        this.data.game = data.game;
        break;
      case INCOMING_MESSAGE_TYPES.HEARTBEAT:
        this.data.game = data.game;
        break;
    }
  };

  onWsClosed = (event) => {
    this.socketStatus = 'closed';
    log.error('Websocket connection closed %o', event);
  };

  onWsMaximum = (event) => {
    this.socketStatus = 'maximum';
    log.error('Websocket maximum reached %o', event);
  };

  onWsError = (error) => {
    log.error('Websocket error %o', error);
  };

  guess() {
    log.trace('guess()', this.id, this.state);
    this.state = 'guess';
    let messageObj = createGuess(this.data)
    if (messageObj) {
      this.socket.send(JSON.stringify(messageObj))
    }
  }

  bonusGuess() {
    log.trace('bonusGuess()', this.id, this.state);
    this.state = 'bonus-guess';
    let messageObj = createBonusGuess(this.data)
    if (messageObj) {
      this.socket.send(JSON.stringify(messageObj))
    }
  }

  performAction() {
    log.trace('performAction', this.id, this.state);
    switch (this.state) {
      case 'disconnected':
        this.connect();
        break;
      case 'connected':
        if (global.game.state === 'active') {
          this.guess();
        } else if (global.game.state === 'bonus') {
          this.bonusGuess();
        }
        break;
      case 'guess':
      case 'bonus-guess':
        this.waitTries++
        if (this.waitTries > maxWaitTries) {
          this.initPlayer();
        }
        break;
      default:
        log.debug('undefined actions', this.state);
        break;
    }
  }

  performDelayedAction(delay) {
    this.actionTimer = setTimeout(() => this.performAction(), delay);
  }

  stop() {
    clearTimeout(this.actionTimer);
    if (this.socket) {
      this.socket.close();
    }
  }
}

function createGuess(botData) {
  const { number, source, destination } = findNumber(botData);

  return {
    type: OUTGOING_MESSAGE_TYPES.GUESS,
    requestId: uuidv4(),
    itemId: lodashGet(botData, 'player.currentRound.id'),
    playerId: lodashGet(botData, 'player.id'),
    gameId: lodashGet(botData, 'game.id'),
    number,
    source,
    destination
  }
}

function createBonusGuess(botData) {
  const { number } = findNumber(botData);

  if (!Number.isInteger(number)) {
    return false;
  }
  let image = numberImages[number];

  return {
    type: OUTGOING_MESSAGE_TYPES.BONUS_GUESS,
    requestId: uuidv4(),
    playerId: lodashGet(botData, 'player.id'),
    gameId: lodashGet(botData, 'game.id'),
    image
  }
}

function findNumber(botData) {
  const choices = lodashGet(botData, 'player.currentRound.choices');
  const answers = lodashGet(botData, 'player.currentRound.answers');

  if (!choices || !answers) {
    return {}
  }

  let source = Math.floor(Math.random() * Math.floor(choices.length));
  let tries = 0;
  let number = choices[source];
  while (!Number.isInteger(number) && tries < choices.length) {
    tries++;
    source++;
    if (source >= choices.length) {
      source = 0;
    }
    number = choices[source];
  }

  if (!Number.isInteger(number)) {
    log.error('failed to find choice %o', choices)
    return {};
  }

  let destination;
  for (let i = 0; i < answers.length; i++) {
    destination = i;
    if (answers[destination].format === 'number' && answers[destination].result !== 'correct') {
      break;
    }
  }

  return {
    number,
    source,
    destination
  }
}

module.exports = Bot;