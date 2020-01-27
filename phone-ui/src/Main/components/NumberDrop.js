import React, { useState } from "react";
import { useDrop } from 'react-dnd';
import { DRAGGABLE_TYPE } from './NumberChoice';

function NumberDrop({number}) {
  const [, drop] = useDrop({
    accept: DRAGGABLE_TYPE.NUMBER_CHOICE,
    drop: ({number}) => updateChoice(number),
  });
  const [choice, updateChoice] = useState(null);

  return <div ref={drop} className='number-drop-area'>{choice}</div>;
}

export default NumberDrop;


