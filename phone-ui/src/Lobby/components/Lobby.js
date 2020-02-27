import React from "react";
import { connect } from "react-redux";
import { ReactComponent as Logo } from "../../images/logo.svg";
import "./Lobby.scss";

function Lobby() {
  return (
    <div className="lobby">
      <Logo className="logo" />
      <h2>The game will begin soon</h2>
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
)(Lobby);
