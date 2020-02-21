import { watchSendPing } from './sendPing';
import { watchSendHelp } from './sendHelp';
import { watchSendGuess } from './sendGuess';

export default [
  watchSendPing(),
  watchSendHelp(),
  watchSendGuess(),
];