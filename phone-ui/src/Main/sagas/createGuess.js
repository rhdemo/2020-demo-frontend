import axios from 'axios'
import { call, put, takeLatest } from 'redux-saga/effects';
import { createAxiosErrorNotification } from '../../Notifications';
import {
  CREATE_GUESS,
  createGuessFulfilled,
  createGuessPending,
  createGuessRejected
} from '../actions';

export const guessUrl = '/api/guesses';

function* executeCreateGuess(action) {
  console.log('createGuess', action);
  let body = createGuessBody(action.payload.guess);
  yield put(createGuessPending(body));
  try {
    const response = yield call(axios.post, guessUrl, body);
    yield put(createGuessFulfilled(response));
  } catch (error) {
    yield put(createAxiosErrorNotification(error));
    yield put(createGuessRejected(error));
  }
}

function createGuessBody(guess) {
  console.log('createGuessBody', guess)
  let body = {
    itemId: guess.itemId,
    playerId: guess.playerId,
    gameId: guess.gameId,
    choices: [...guess.choices],
    answers: [...guess.answers]
  };

  body.answers[guess.destination] = {
    number: guess.choices[guess.source],
    from: guess.source,
    result: null,
  };

  body.choices[guess.source] = null;

  return body
}

export function* watchCreateGuess() {
  yield takeLatest(CREATE_GUESS, executeCreateGuess);
}

