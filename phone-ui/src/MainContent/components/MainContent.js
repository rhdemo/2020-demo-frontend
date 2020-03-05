import React from "react";

import "./MainContent.scss";

function MainContent(props) {
  return (
    <main className="MainContent">
      <div className="mountains"></div>
      <div className="content">{props.children}</div>
    </main>
  );
}

export default MainContent;
