'use strict';
const log = require('../../utils/log')('game-service');
const {GAME_DATA_KEYS} = require("../../models/constants");
const Game = require("../../models/game");

module.exports = async function (fastify, opts) {
  // fastify.setNotFoundHandler(function (request, reply) {
  //   reply
  //     .code(404)
  //     .type('application/json')
  //     .send({ message: 'Requested resource does not exist' });
  // });

  fastify.get('/games/:id', async function (request, reply) {
    let game;
    try {
      game = await Game.find(request.params.id);
      return game ? game.toDict() : reply.callNotFound();
    } catch (error) {
      log.error(error);
      reply
        .code(500)
        .type('application/json')
        .send({ message: 'Error fetching requested game'});
    }
  });
};
