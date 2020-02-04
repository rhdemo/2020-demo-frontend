import React, { lazy, Suspense, useEffect } from 'react';
import { connect } from 'react-redux';

import './App.scss';
import GAME_STATES from '../../utilities/GameStates';

const Lobby = lazy(() => import('../../Lobby'));
const Paused = lazy(() => import('../../Paused'));
const Main = lazy(() => import('../../Main'));
const Bonus = lazy(() => import('../../Bonus'));
const GameOver = lazy(() => import('../../GameOver'));
const Loading = lazy(() => import('../../Loading'));


function App({game}) {

  let gameScreen = <Lobby/>;

  if (!game) {
    gameScreen = <Loading/>
  } else {
    switch (game.state) {
      case GAME_STATES.PAUSED:
        gameScreen = <Paused/>;
        break;
      case GAME_STATES.ACTIVE:
        gameScreen = <Main/>;
        break;
      case GAME_STATES.BONUS:
        gameScreen = <Bonus/>;
        break;
      case GAME_STATES.STOPPED:
        gameScreen = <GameOver/>;
        break;
      default:
        gameScreen = <Lobby/>;
        break;
    }
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
