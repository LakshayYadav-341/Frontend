import { combineReducers } from 'redux';
import authReducer from './Reducer/authReducer';

const rootReducer = combineReducers({
  auth: authReducer,
});

export default rootReducer;
