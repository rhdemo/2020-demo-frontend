import get from 'lodash/get';

import { GET_STATUS_FULFILLED } from './actions';
import { WS_INCOMING_MESSAGE } from '../Socket/actions';
import { INCOMING_MESSAGE_TYPES } from '../Socket/messageTypes';

const initialState = {
  game: null,
  player: null,
  status: null,
  lastHeartbeat: null
};

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case WS_INCOMING_MESSAGE:
      return processWsMessage(state, action.payload);
    case GET_STATUS_FULFILLED:
      return {
        ...state,
        status: get(action, 'payload.response.data'),
      };
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
        game: message.game
      };
    case INCOMING_MESSAGE_TYPES.HEARTBEAT:
      return {
        ...state,
        lastHeartbeat: new Date()
      };
    default:
      return state;
  }
}