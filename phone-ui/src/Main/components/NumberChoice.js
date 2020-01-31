import React from 'react';
import { DragSource, useDrag } from 'react-dnd';

const DRAGGABLE_TYPE = {
  NUMBER_CHOICE:'NumberChoice'
};

function NumberChoice({number}) {
  const [collectedProps, drag] = useDrag({
    item: { number,  type:  DRAGGABLE_TYPE.NUMBER_CHOICE},
  });

  return <div ref={drag} className='number-choice'>{number}</div>;

}

export default NumberChoice
export {NumberChoice, DRAGGABLE_TYPE}
