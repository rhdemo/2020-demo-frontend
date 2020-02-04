import React from 'react';
import { connect } from 'react-redux';

import './Paused.scss';

function Paused() {

  return (
    <div className='paused'>
      <h1>Paused</h1>
    </div>
  );
}

function mapStateToProps(state) {
  return state.appReducer;
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Paused);
