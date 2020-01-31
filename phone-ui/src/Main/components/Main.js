import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DndProvider } from 'react-dnd'
import dndHtmlBackend from 'react-dnd-html5-backend'
import dndTouchBackend from 'react-dnd-touch-backend'

import NumberChoice from './NumberChoice'
import NumberDrop from './NumberDrop'
import { sendPing } from '../actions';

import './Main.scss';

let mockChoices = [];
for (let i = 0; i < 6; i++) {
  const number = Math.floor(Math.random() * Math.floor(10));
  mockChoices.push(number);
}


let mockAnswers = [];
for (let i = 0; i < 4; i++) {
  const number = Math.floor(Math.random() * Math.floor(10));
  mockAnswers.push(number);
}

function Main({player, sendPing}) {
  const dndBackend = 'ontouchstart' in window ? dndTouchBackend : dndHtmlBackend;

  return (
    <DndProvider backend={dndBackend} opts={{enableMouseEvents: true}}>
      <div className='main'>
        <div className='player'>
          <div className='avatar'>
            <FontAwesomeIcon icon={['far', 'user-circle']}/>
          </div>
          <div className='text-info'>
            <h2>{player.username}</h2>
            <h2>{player.score} points</h2>
          </div>
        </div>
        <div className='item'>
          <div className='heading'>
            Guess the price
          </div>
          <div className='image'>
            <div>
              <p>Image</p>
            </div>
          </div>
        </div>
        <div className='number-input'>
          {mockAnswers.map((n, index) => <NumberDrop key={index} number={n}/>)}
        </div>

        <div className='number-select'>
          {mockChoices.map((n, index) => <NumberChoice key={index} number={n}/>)}
        </div>

        <div className='help'>
          <button
            onClick={sendPing}>
            Help!
          </button>
        </div>
      </div>
    </DndProvider>
  );
}

function mapStateToProps(state) {
  return state.appReducer;
}

function mapDispatchToProps(dispatch) {
  return {
    sendPing: () => {
      dispatch(sendPing());
    }
  };}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
