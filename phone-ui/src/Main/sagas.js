import { put, takeLatest } from 'redux-saga/effects';

import { sendOutgoingMessage } from '../Socket/actions';
import { SEND_PING } from './actions';

function* executeSendPing(action) {
  yield put(sendOutgoingMessage({type: 'ping'}));
}

export function* watchSendPing() {
  yield takeLatest(SEND_PING, executeSendPing);
}

export default [
  watchSendPing()
];