import React from "react";
import { connect } from "react-redux";

import "./Header.scss";

function Header({ player }) {
  const pointsSuffix = player.score === 1 ? "" : "s";
  const playerNameArray = player.username.split("");
  const displayArray = [];

  playerNameArray.forEach(letter => {
    displayArray.push(`<span>${letter}</span>`);
  });

  const displayName = { __html: displayArray.join("") };

  return (
    <header className="Header">
      <div className="container">
        <div className="avatar"></div>
        <div className="player-details">
          <h1 dangerouslySetInnerHTML={displayName}></h1>
          <div className="points-location">
            <div>
              <img
                src={require("../../images/icon-points.svg")}
                alt="Points icon"
                className="icon"
              />{" "}
              {player.score} point
              {pointsSuffix}
            </div>
            <div>
              <img
                src={require("../../images/icon-location.svg")}
                alt="Location icon"
                className="icon"
              />{' ' + player.gameServer}
            </div>
          </div>
        </div>
      </div>
    </header>
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
)(Header);
