import React from "react";
import { connect } from "react-redux";
import lodashGet from "lodash/get";

import "./History.scss";

function History({ player }) {
  return (
    <div className="History">
      <table>
        <thead>
          <tr>
            <th>Object</th>
            <th className="center">
              <img
                src={require("../../images/history-check.svg")}
                alt="Correct guesses"
                className="icon"
              />
            </th>
            <th className="center">
              <img
                src={require("../../images/history-x.svg")}
                alt="Incorrect guesses"
                className="icon"
              />
            </th>
            <th>Dollars</th>
          </tr>
        </thead>
        <tbody>
          {player.history.map(round => (
            <tr key={round.itemId}>
              <td>{round.itemName}</td>
              <td className="center">{round.right}</td>
              <td className="center">{round.wrong}</td>
              <td>${round.points || 0}</td>
            </tr>
          ))}
          <tr className="last">
            <td>Total</td>
            <td className="center">{player.score.right}</td>
            <td className="center">{player.score.wrong}</td>
            <td>${lodashGet(player, "score.score")}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function mapStateToProps(state) {
  return state.appReducer;
}

export default connect(mapStateToProps)(History);
