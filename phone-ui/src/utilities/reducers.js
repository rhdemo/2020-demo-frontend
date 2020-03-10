import { combineReducers } from 'redux';
import { notificationsReducer } from '../Notifications/reducers';
import { appReducer } from '../App/reducers';
import { bonusReducer } from '../Bonus/reducers';
import { mainReducer } from '../Main/reducers';

const rootReducer = combineReducers({
  appReducer,
  bonusReducer,
  mainReducer,
  notificationsReducer
});

export default rootReducer;
