import React from "react";
import "./Message.scss";

function Message(props) {
  return (
    <h2 className="Message">{props.children}</h2>
  );
}

export default Message;
