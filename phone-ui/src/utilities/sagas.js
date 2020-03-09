import { all } from 'redux-saga/effects';
import socketSagas from '../Socket/sagas';
import appSagas from '../App/sagas';
import bonusSagas from '../Bonus/sagas';
import mainSagas from '../Main/sagas';

export default function* rootSaga() {
  yield all([
    ...socketSagas,
    ...appSagas,
    ...bonusSagas,
    ...mainSagas
  ]);
}
