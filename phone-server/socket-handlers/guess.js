const log = require('../utils/log')('socket-handlers/guess');
const send = require('../utils/send');

async function guessHandler(ws, messageObj) {
  send(ws, '{"type":"player-configuration","player":{"id":"Local Machine - Glow Fly","username":"Glow Fly","avatar":{"body":2,"eyes":2,"mouth":3,"ears":2,"nose":1,"color":5},"gameId":"a4479452-49de-49ae-85c5-482f067d9e03","score":0,"right":0,"wrong":0,"history":[{"itemId":0,"itemName":"Dollar bill","right":0,"wrong":0,"points":null}],"lastRound":null,"currentRound":{"itemId":0,"choices":[9,1,0,5,0,1],"answers":[{"format":"number"},{"format":"decimal"},{"format":"number"},{"format":"number"}],"image":"/static/images/0.jpg","points":100,"correct":false},"creationServer":"Local Machine","gameServer":"Local Machine","scoringServer":"UNKN"},"game":{"id":"a4479452-49de-49ae-85c5-482f067d9e03","state":"active","date":"2020-03-22T18:38:40.593Z","configuration":{}}}');
}

module.exports = guessHandler;
