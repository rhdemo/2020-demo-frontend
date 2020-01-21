import React from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Main.scss";

function Main() {

  return (
    <div className="main">
      <div className="player">
        <div className="avatar">
          <FontAwesomeIcon icon={["far", "user-circle"]}/>
        </div>
        <div className="text-info">
          <h2>Fuzzy Nuggets</h2>
          <h2>450 points</h2>
        </div>
      </div>
      <div className="item">
        <div className="heading">
          Guess the price
        </div>
        <div className="image">
          <div>
            <p>Image</p>
          </div>
        </div>
      </div>
      <div className="drop-numbers">

      </div>
      <div className="number-input">
        <div className="number-drop-area"/>
        <div className="number-drop-area"/>
        <div className="number-drop-area"/>
        <div className="number-drop-area"/>
      </div>

      <div className="number-select">
        <div className="number-choice">6</div>
        <div className="number-choice">7</div>
        <div className="number-choice">5</div>
        <div className="number-choice">3</div>
        <div className="number-choice">1</div>
        <div className="number-choice">6</div>
      </div>

      <div className="help">
        <button>
          Help!
        </button>
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

export default connect(mapStateToProps, mapDispatchToProps)(Main);
