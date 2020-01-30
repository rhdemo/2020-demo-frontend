import React from 'react';
import { connect } from 'react-redux';

import './Bonus.scss';

function Bonus() {

  return (
      <div className='bonus'>
        <h1>Bonus</h1>
      </div>
  );
}

function mapStateToProps(state) {
  return state.appReducer;
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Bonus);
