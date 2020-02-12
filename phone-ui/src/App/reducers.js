import { WS_INCOMING_MESSAGE } from '../Socket/actions';
import { INCOMING_MESSAGE_TYPES } from '../Socket/messageTypes';


const initialState = {
  game: null
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
      return {
        ...state,
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