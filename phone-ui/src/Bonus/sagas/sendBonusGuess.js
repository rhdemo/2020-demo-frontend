import { put, takeLatest } from 'redux-saga/effects';
import { v4 as uuidv4 } from 'uuid';

import { sendOutgoingMessage } from '../../Socket/actions';
import { SEND_BONUS_GUESS } from '../actions';
import { OUTGOING_MESSAGE_TYPES } from '../../Socket/messageTypes'

function* executeSendBonusGuess(action) {
  yield put(sendOutgoingMessage(createBonusGuessMessage(action.payload.guess)));
}

function createBonusGuessMessage(guess) {
  let msg = {
    type: OUTGOING_MESSAGE_TYPES.BONUS_GUESS,
    requestId: uuidv4(),
    ...guess
  };

  return msg
}

export function* watchSendBonusGuess() {
  yield takeLatest(SEND_BONUS_GUESS, executeSendBonusGuess);
}