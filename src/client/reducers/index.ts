import {combineReducers} from "redux";
import configReducer from './config';

export default combineReducers({
    config: configReducer
});