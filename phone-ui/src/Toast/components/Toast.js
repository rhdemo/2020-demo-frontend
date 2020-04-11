import React from "react";

import "./Toast.scss";

function Toast({ className, children }) {
  return <div className={`Toast ${className}`}>{children}</div>;
}

export default Toast;
