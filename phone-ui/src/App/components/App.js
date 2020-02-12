import React from 'react';
import { connect } from 'react-redux';
import Lobby from '../../Lobby';
import Paused from '../../Paused';
import Main from '../../Main';
import Bonus from '../../Bonus';
import GameOver from '../../GameOver';
import Loading from '../../Loading';
import GAME_STATES from '../../utilities/GameStates';

import './App.scss';

function App({game}) {

  if (!game) {
    return <Loading/>
  } else {
    switch (game.state) {
      case GAME_STATES.PAUSED:
        return <Paused/>;
      case GAME_STATES.ACTIVE:
        return <Main/>;
      case GAME_STATES.BONUS:
        return <Bonus/>;
      case GAME_STATES.STOPPED:
        return <GameOver/>;
      default:
        return <Lobby/>;
        }
  }
}

function mapStateToProps(state) {
  return state.appReducer;
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
