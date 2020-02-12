import { put, takeLatest } from 'redux-saga/effects';

import { sendOutgoingMessage } from '../../Socket/actions';
import { SEND_PING } from '../actions';
import { OUTGOING_MESSAGE_TYPES } from '../../Socket/messageTypes'

function* executeSendPing(action) {
  yield put(sendOutgoingMessage({type: OUTGOING_MESSAGE_TYPES.PING}));
}

export function* watchSendPing() {
  yield takeLatest(SEND_PING, executeSendPing);
}