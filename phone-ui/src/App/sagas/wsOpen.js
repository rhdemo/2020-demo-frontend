import { put, takeLatest } from 'redux-saga/effects';

import { sendOutgoingMessage, WS_OPEN } from '../../Socket/actions';
import { OUTGOING_MESSAGE_TYPES } from '../../Socket/messageTypes';

function* executeSendInit(action) {
  let msg = {
    type: OUTGOING_MESSAGE_TYPES.INIT,
    playerId: localStorage.getItem('playerId') || undefined,
    playerKey: localStorage.getItem('playerKey') || undefined,
    gameId: localStorage.getItem('gameId') || undefined,
  };
  yield put(sendOutgoingMessage(msg));
}

export function* watchWsOpen() {
  yield takeLatest(WS_OPEN, executeSendInit);
}
