import React from 'react';
import { useDrag } from 'react-dnd';
import cx from "classnames";

const DRAGGABLE_TYPE = {
  NUMBER_CHOICE: 'NumberChoice'
};

function NumberChoice({index, number}) {
  const [collectedProps, drag] = useDrag({
    item: {
      index,
      number,
      type:  DRAGGABLE_TYPE.NUMBER_CHOICE}
  });

  let status = Number.isInteger(number) ? 'filled' : 'empty';
  let classNames = cx('number-choice', 'number', status);
  return <div ref={drag} className={classNames}>{number}</div>;

}

export default NumberChoice
export {NumberChoice, DRAGGABLE_TYPE}
