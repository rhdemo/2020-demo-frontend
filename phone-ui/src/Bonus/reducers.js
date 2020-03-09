import { CREATE_BONUS_GUESS_PENDING, CREATE_BONUS_GUESS_FULFILLED, CREATE_BONUS_GUESS_REJECTED } from './actions';
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

export const bonusReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_BONUS_GUESS_PENDING:
      return {
        ...state,
        guessInProgress: true
      };
    case CREATE_BONUS_GUESS_REJECTED:
      return {
        ...state,
        guessInProgress: false
      };
    case CREATE_BONUS_GUESS_FULFILLED:
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