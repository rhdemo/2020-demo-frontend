import get from 'lodash/get';

import { GET_STATUS_FULFILLED } from './actions';
import { WS_INCOMING_MESSAGE } from '../Socket/actions';

const initialState = {
  status: null,
  lastMessage: null,
  lastMessageDate: null
};

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case WS_INCOMING_MESSAGE:
      return {
        ...state,
        lastMessage: get(action, 'payload'),
        lastMessageDate: new Date(),
      };
    case GET_STATUS_FULFILLED:
      return {
        ...state,
        status: get(action, 'payload.response.data'),
      };
    default:
      return state;
  }
};
