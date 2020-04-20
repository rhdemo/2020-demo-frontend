import React, { useState } from "react";
import { connect } from 'react-redux';
import { useDrop } from 'react-dnd';
import cx from "classnames";
import { DRAGGABLE_TYPE } from './NumberChoice';
import { sendGuess } from '../actions';

function NumberDrop({index, answer, game, player, currentRound, sendGuess}) {
  const [choice, updateChoice] = useState(null);
  const [, drop] = useDrop({
    accept: DRAGGABLE_TYPE.NUMBER_CHOICE,
    drop: (dropped) => {
      console.log('drop', dropped);
      onDrop(dropped);
    },
  });

  function onDrop(dropped) {
    let choices = [...currentRound.choices];
    let answers = [...currentRound.answers];

    let guess = {
      itemId: currentRound.id,
      playerId: player.id,
      gameId: game.id,
      choices,
      source: dropped.index,
      answers,
      destination: index,
    };
    console.log('onDrop guess=', guess);

    sendGuess(guess);
  }

  if (answer.format === 'decimal') {
    return <div className='number-drop-area decimal'>.</div>;
  }

  let classNames = cx('number-drop-area', 'number', { empty: !Number.isInteger(answer.number)}, answer.result);
  return <div ref={drop} className={classNames}>{answer.number}</div>;
}

function mapStateToProps(state) {
  return state.appReducer;
}

function mapDispatchToProps(dispatch) {
  return {
    sendGuess: (guess) => {
      dispatch(sendGuess(guess));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NumberDrop);



