import get from 'lodash/get';

import { CREATE_GUESS_PENDING, CREATE_GUESS_FULFILLED, CREATE_GUESS_REJECTED } from './actions';
import { WS_INCOMING_MESSAGE } from '../Socket/actions';
import { INCOMING_MESSAGE_TYPES } from '../Socket/messageTypes';


const initialState = {
  game: null,
  player: null,
  currentRound: {
    choices: [],
    answers: [],
    results: []
  },
  guessInProgress: false
};

export const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_GUESS_PENDING:
      return {
        ...state,
        guessInProgress: true
      };
    case CREATE_GUESS_REJECTED:
      return {
        ...state,
        guessInProgress: false
      };
    case CREATE_GUESS_FULFILLED:
      return {
        ...state,
        guessInProgress: false
      };
    case WS_INCOMING_MESSAGE:
      return processWsMessage(state, action.payload);
    default:
      return state;
  }
};

function processWsMessage(state, message) {
  switch (message.type) {
    case INCOMING_MESSAGE_TYPES.PLAYER_CONFIGURATION:
      updateLocalStorage(state, message);
      return {
        ...state,
        player: message.player,
        game: message.game,
        currentRound: message.player.currentRound
      };
    default:
      return state;
  }
}

function updateLocalStorage(state, message) {
  const originalPlayerId = get(state, 'player.id');
  const originalGameId = get(state, 'game.id');
  const playerId = get(message, 'player.id');
  const gameId = get(message, 'game.id');

  if (playerId && playerId !== originalPlayerId) {
    localStorage.setItem('playerId', playerId);
  }

  if (gameId && gameId !== originalGameId) {
    localStorage.setItem('gameId', gameId);
  }
}