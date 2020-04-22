import React from "react";
import { connect } from "react-redux";
import MainContent from "../../MainContent";
import Message from "../../Message";
import Header from "../../Header";
import History from "../../History";
import "./GameOver.scss";

function GameOver({ game, player }) {
  return (
    <div className="GameOver">
      <Header></Header>
      <MainContent>
        <Message>Game Over</Message>
        <History></History>
      </MainContent>
    </div>
  );
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
)(GameOver);
