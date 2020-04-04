import { put, takeLatest } from 'redux-saga/effects';
import { v4 as uuidv4 } from 'uuid';

import { sendOutgoingMessage } from '../../Socket/actions';
import { SEND_GUESS } from '../actions';
import { OUTGOING_MESSAGE_TYPES } from '../../Socket/messageTypes'

function* executeSendGuess(action) {
  yield put(sendOutgoingMessage({
    type: OUTGOING_MESSAGE_TYPES.GUESS,
    requestId: uuidv4(),
    ...action.payload.guess
  }));
}

export function* watchSendGuess() {
  yield takeLatest(SEND_GUESS, executeSendGuess);
}