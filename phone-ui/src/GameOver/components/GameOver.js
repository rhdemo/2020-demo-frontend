import React from "react";
import { connect } from "react-redux";
import Header from "../../Header";
import History from "../../History";
import "./GameOver.scss";

function GameOver({ game, player }) {
  return (
    <div className="GameOver">
      <h1 className="title">Game Over</h1>
      <Header></Header>
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
            <td className="total">{player.right}</td>
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
            <td className="total">{player.wrong}</td>
          </tr>
        </tbody>
      </table>
      <History></History>
    </div>
  );
}

function mapStateToProps(state) {
  return state.mainReducer;
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameOver);
