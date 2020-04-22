import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import Header from "../../Header";
import MainContent from "../../MainContent";
import Toast from "../../Toast";
import Button from "../../Button";
import Message from "../../Message";
import History from "../../History";
import "./Paused.scss";

function Paused({ player }) {
  const gameServerRef = useRef(player.gameServer);
  const [toastClass, setToastClass] = useState("");

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
        <Message>Paused</Message>
        <History></History>
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
  return state.appReducer;
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Paused);
