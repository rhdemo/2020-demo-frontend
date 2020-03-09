
export const SEND_BONUS_GUESS = 'Bonus.SEND_BONUS_GUESS';
export const sendBonusGuess = (guess) => ({
  type: SEND_BONUS_GUESS,
  payload: {guess}
});

export const CREATE_BONUS_GUESS = 'Bonus.CREATE_BONUS_GUESS';
export const createBonusGuess = (guess) => ({
  type: CREATE_BONUS_GUESS,
  payload: {guess}
});

export const CREATE_BONUS_GUESS_PENDING = 'Bonus.CREATE_BONUS_GUESS_PENDING';
export const createBonusGuessPending = (guess) => ({
  type: CREATE_BONUS_GUESS_PENDING,
  payload: {guess}
});


export const CREATE_BONUS_GUESS_FULFILLED = 'Bonus.CREATE_BONUS_GUESS_FULFILLED';
export const createBonusGuessFulfilled = (response) => ({
  type: CREATE_BONUS_GUESS_FULFILLED,
  payload: {
    response
  }
});

export const CREATE_BONUS_GUESS_REJECTED = 'Bonus.CREATE_BONUS_GUESS_REJECTED';
export const createBonusGuessRejected = (error) => ({
  type: CREATE_BONUS_GUESS_REJECTED,
  payload: {
    error
  }
});
