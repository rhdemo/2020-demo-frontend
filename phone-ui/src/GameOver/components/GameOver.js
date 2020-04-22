import React from "react";
import { connect } from "react-redux";
import Message from "../../Message";
import Header from "../../Header";
import History from "../../History";
import "./GameOver.scss";

function GameOver({ game, player }) {
  return (
    <div className="GameOver">
      <Message>Game Over</Message>
      <Header></Header>
      <div className="content">
        <table className="score-table">
          <tbody>
            <tr>
              <td className="icon-cell">
                <img
                  src={require("../../images/history-check.svg")}
                  alt="Correct guesses"
                  className="icon"
                />
              </td>
              <td>Correct Guesses:</td>
              <td className="total">{player.score.right}</td>
            </tr>
            <tr>
              <td className="icon-cell">
                <img
                  src={require("../../images/history-x.svg")}
                  alt="Incorrect guesses"
                  className="icon"
                />
              </td>
              <td>Incorrect Guesses:</td>
              <td className="total">{player.score.wrong}</td>
            </tr>
          </tbody>
        </table>
        <History></History>
      </div>
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
