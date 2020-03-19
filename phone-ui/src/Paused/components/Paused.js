import React from "react";
import { connect } from "react-redux";
import Header from "../../Header";
import MainContent from "../../MainContent";
import "./Paused.scss";

function Paused({ player }) {
  return (
    <div className="paused">
      <Header></Header>
      <MainContent>
        <h2>Paused</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Object</th>
                <th className="center">√</th>
                <th className="center">X</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {player.history.map(round => (
                <tr key={round.itemId}>
                  <td>{round.itemName}</td>
                  <td className="center">{round.right}</td>
                  <td className="center">{round.wrong}</td>
                  <td>{round.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MainContent>
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
)(Paused);
