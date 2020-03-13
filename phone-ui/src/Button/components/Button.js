import React from "react";
import "./Button.scss";

function Button(props) {
  return (
    <button className="Button" onClick={props.handleClick}>
      <span>{props.children}</span>
    </button>
  );
}

export default Button;
