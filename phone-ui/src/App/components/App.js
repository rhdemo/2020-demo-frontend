import React, { lazy, Suspense, useEffect } from 'react';
import { connect } from 'react-redux';

import './App.scss';

const Lobby = lazy(() => import('../../Lobby'));
const Main = lazy(() => import('../../Main'));
const Bonus = lazy(() => import('../../Bonus'));


function App({game}) {

  let gameScreen = <Lobby/>;
  if (game && game.state === 'playing') {
    gameScreen =  <Main/>;
  } else if (game && game.state === 'bonus') {
    gameScreen = <Bonus/>;
  }

  return (
    <Suspense fallback={<div className='loading'><h1>Loading...</h1></div>}>
      {gameScreen}
    </Suspense>
  );
}

function mapStateToProps(state) {
  return state.appReducer;
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
