'use strict';
const log = require('../../utils/log')('game-service');
const {GAME_STATES} = require("../../models/constants");
const Player = require('../../models/player');

module.exports = async function (fastify, opts) {
  fastify.post('/guesses', async function (request, reply) {
    let guess = request.body;
    let {itemId, playerId, gameId, choices, answers} = guess;


    if (!gameId || gameId !== global.game.id || !playerId || !choices || !answers) {
      log.warn(`Ignoring incoming malformed guess data.`);
      return reply
        .code(400)
        .type('application/json')
        .send({ message: 'Malformed request' });
    }

    if (global.game.state !== GAME_STATES.ACTIVE) {
      log.warn(`Ignoring incoming guess because the game is in state ${global.game.state}`);
      return reply
        .code(403)
        .type('application/json')
        .send({ message: 'Game not active' });
    }

    let player;
    try {
      player = await Player.find(playerId);
    } catch (error) {
      log.error(`Player ${playerId} data not found`);
      return reply
        .code(400)
        .type('application/json')
        .send({ message: 'User not found' });
    }

    player.addGuess(guess);

    try {
      await player.save();
    } catch (error) {
      log.error(`Player ${playerId} data not saved`);
      return reply
        .code(500)
        .type('application/json')
        .send({ message: 'Player save failed' });
    }

    return {player: player.toDict(), guess};
  });
};

