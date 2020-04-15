import React from "react";
import { connect } from "react-redux";
import lodashGet from "lodash/get";
import Avatar from "../../Avatar";
import "./Header.scss";

function Header({ player }) {
  return (
    <header className="Header">
      <div className="container">
        <div className="avatar">
          <Avatar></Avatar>
        </div>
        <div className="player-details">
          <h1 className="username">{player.username}</h1>
          <div className="points-location">
            <div>
              <img
                src={require("../../images/icon-money.svg")}
                alt="Money icon"
                className="icon"
              />{" "}
              ${lodashGet(player, "score.score")}
            </div>
            <div>
              <img
                src={require("../../images/icon-location.svg")}
                alt="Location icon"
                className="icon"
              />
              {" " + player.gameServer}
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
