import React from 'react';
import { connect } from 'react-redux';

import './Loading.scss';

function Loading() {

  return (
    <div className='loading'>
      <h1>Loading</h1>
    </div>
  );
}

function mapStateToProps(state) {
  return state.appReducer;
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Loading);
