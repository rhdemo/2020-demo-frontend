import React from 'react';
import { connect } from 'react-redux';

import './Lobby.scss';

function Lobby() {

  return (
    <div className='lobby'>
      <h1>Lobby</h1>
    </div>
  );
}

function mapStateToProps(state) {
  return state.appReducer;
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);
