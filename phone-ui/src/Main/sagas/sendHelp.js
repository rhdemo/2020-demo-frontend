import { put, takeLatest } from 'redux-saga/effects';

import { sendOutgoingMessage } from '../../Socket/actions';
import { SEND_HELP } from '../actions';
import { OUTGOING_MESSAGE_TYPES } from '../../Socket/messageTypes'

function* executeSendHelp(action) {
  yield put(sendOutgoingMessage({type: OUTGOING_MESSAGE_TYPES.HELP}));
}

export function* watchSendHelp() {
  yield takeLatest(SEND_HELP, executeSendHelp);
}