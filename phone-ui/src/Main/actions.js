export const SEND_PING = 'Main.SEND_PING';
export const sendPing = () => ({
  type: SEND_PING
});

export const SEND_HELP = 'Main.SEND_HELP';
export const sendHelp = () => ({
  type: SEND_HELP
});

export const SEND_GUESS = 'Main.SEND_GUESS';
export const sendGuess = (guess) => ({
  type: SEND_GUESS,
  payload: {guess}
});

export const CREATE_GUESS = 'Main.CREATE_GUESS';
export const createGuess = (guess) => ({
  type: CREATE_GUESS,
  payload: {guess}
});

export const CREATE_GUESS_PENDING = 'Main.CREATE_GUESS_PENDING';
export const createGuessPending = (guess) => ({
  type: CREATE_GUESS_PENDING,
  payload: {guess}
});


export const CREATE_GUESS_FULFILLED = 'Main.CREATE_GUESS_FULFILLED';
export const createGuessFulfilled = (response) => ({
  type: CREATE_GUESS_FULFILLED,
  payload: {
    response
  }
});

export const CREATE_GUESS_REJECTED = 'Main.CREATE_GUESS_REJECTED';
export const createGuessRejected = (error) => ({
  type: CREATE_GUESS_REJECTED,
  payload: {
    error
  }
});
