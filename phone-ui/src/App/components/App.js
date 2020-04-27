import React, { useEffect } from "react";
import { connect } from "react-redux";
import Lobby from "../../Lobby";
import Paused from "../../Paused";
import Main from "../../Main";
import Bonus from "../../Bonus";
import GameOver from "../../GameOver";
import Loading from "../../Loading";
import GAME_STATES from "../../utilities/GameStates";

import "./App.scss";

function App({ game, player }) {
  useEffect(() => {
    preloadImages();
  }, []);

  if (!game || !player) {
    return <Loading />;
  } else {
    switch (game.state) {
      case GAME_STATES.PAUSED:
        return <Paused />;
      case GAME_STATES.ACTIVE:
        return <Main />;
      case GAME_STATES.BONUS:
        return <Bonus />;
      case GAME_STATES.STOPPED:
        return <GameOver />;
      default:
        return <Lobby />;
    }
  }
}

function preloadImages() {
  let i = 0;
  const numImages = 19;
  const interval = setInterval(() => {
    if (i === numImages) {
      clearInterval(interval);
    }

    new Image().src = `/static/images/${i}.png`;
    i++;
  }, 1000);
}

function mapStateToProps(state) {
  return state.appReducer;
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
