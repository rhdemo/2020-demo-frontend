import { watchSendGuess } from './sendGuess';
import { watchCreateGuess } from './createGuess';
import { watchSendPing } from './sendPing';

export default [
  watchCreateGuess(),
  watchSendPing(),
  watchSendGuess(),
];