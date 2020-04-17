import get from 'lodash/get';
import { WS_INCOMING_MESSAGE } from '../Socket/actions';
import { INCOMING_MESSAGE_TYPES } from '../Socket/messageTypes';


const initialState = {
  game: null,
  leaderboard: [],
  player: null,
  currentRound: {
    choices: [],
    answers: [],
    results: []
  }
};

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
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
        player: get(message, 'player'),
        game: get(message, 'game'),
        currentRound: get(message, 'player.currentRound'),
      };
    case INCOMING_MESSAGE_TYPES.HEARTBEAT:
      return {
        ...state,
        game: get(message, 'game'),
        leaderboard: get(message, 'leaderboard'),
        lastHeartbeat: new Date()
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