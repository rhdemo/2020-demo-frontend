import { combineReducers } from 'redux';
import { notificationsReducer } from '../Notifications/reducers';
import { appReducer } from '../App/reducers';
import { mainReducer } from '../Main/reducers';

const rootReducer = combineReducers({
  appReducer,
  mainReducer,
  notificationsReducer
});

export default rootReducer;
