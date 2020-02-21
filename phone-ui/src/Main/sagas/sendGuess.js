import { put, takeLatest } from 'redux-saga/effects';

import { sendOutgoingMessage } from '../../Socket/actions';
import { SEND_GUESS } from '../actions';
import { OUTGOING_MESSAGE_TYPES } from '../../Socket/messageTypes'

function* executeSendGuess(action) {
  yield put(sendOutgoingMessage(createGuessMessage(action.payload.guess)));
}

function createGuessMessage(guess) {
  let msg = {
    type: OUTGOING_MESSAGE_TYPES.GUESS,
    itemId: guess.itemId,
    playerId: guess.playerId,
    gameId: guess.gameId,
    choices: [...guess.choices],
    answers: [...guess.answers]
  };

  msg.answers[guess.destination] = {
    format: guess.answers[guess.destination].format,
    number: guess.choices[guess.source],
    from: guess.source,
    result: null,
  };

  msg.choices[guess.source] = null;
  return msg
}

export function* watchSendGuess() {
  yield takeLatest(SEND_GUESS, executeSendGuess);
}