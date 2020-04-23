import React from "react";
import { connect } from "react-redux";
import Message from "../../Message";
import { ReactComponent as Mountains } from "../../images/small-mountains.svg";
import Avatar from "../../Avatar";
import "./Lobby.scss";

function Lobby({ player }) {
  return (
    <div className="lobby">
      <div className="bg">
        <Mountains />
      </div>
      <div className="avatarContainer">
        <Avatar />
        <div className="speechBubble">
          <h1>Guess That Price!</h1>
        </div>
      </div>
      <div className="messageContainer">
        <Message>Game will begin shortly</Message>
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
)(Lobby);
