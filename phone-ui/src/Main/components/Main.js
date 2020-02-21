import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import { DndProvider } from 'react-dnd'
import dndHtmlBackend from 'react-dnd-html5-backend'
import dndTouchBackend from 'react-dnd-touch-backend'

import NumberChoice from './NumberChoice'
import NumberDrop from './NumberDrop'
import { sendHelp } from '../actions';

import './Main.scss';

function Main({player, currentRound, sendHelp}) {
  const dndBackend = 'ontouchstart' in window ? dndTouchBackend : dndHtmlBackend;

  return (
    <DndProvider backend={dndBackend} opts={{enableMouseEvents: true}}>
      <div className='main'>
        <div className='player'>
          <div className='avatar'>
            <FontAwesomeIcon icon={faUserCircle}/>
          </div>
          <div className='text-info'>
            <h2>{player.username}</h2>
            <h2>{player.score} points</h2>
          </div>
        </div>
        <div className='item'>
          <div className='image'>
            <img src={currentRound.image}/>
          </div>
        </div>
        <div className='number-input'>
          <div className='number-drop-area dollar-sign'>$</div>
          {currentRound.answers.map((a, index) => <NumberDrop key={index} index={index} answer={a}/>)}
        </div>

        <div className='number-select'>
          {currentRound.choices.map((c, index) => <NumberChoice key={index} index={index} number={c}/>)}
        </div>

        <div className='help'>
          <button
            onClick={sendHelp}>
            Help!
          </button>
        </div>
      </div>
    </DndProvider>
  );
}

function mapStateToProps(state) {
  return state.mainReducer;
}

function mapDispatchToProps(dispatch) {
  return {
    sendHelp: () => {
      dispatch(sendHelp());
    }
  };}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
