import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import Header from "../../Header";
import MainContent from "../../MainContent";
import Toast from "../../Toast";
import Button from "../../Button";
import "./Paused.scss";

function Paused({ player }) {
  const gameServerRef = useRef(player.gameServer);
  const [toastClass, setToastClass] = useState("show");

  useEffect(() => {
    if (gameServerRef.current !== player.gameServer) {
      setToastClass("show");
    }

    gameServerRef.current = player.gameServer;
  }, [player.gameServer]);

  function dismissToast() {
    setToastClass("");
  }

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
            </tbody>
          </table>
        </div>
      </MainContent>
      <Toast className={`info ${toastClass}`}>
        <div>Your new cluster is</div>
        <div>{player.gameServer}</div>
        <Button handleClick={dismissToast}>Close</Button>
      </Toast>
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
