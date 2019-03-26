import {combineReducers} from "redux";
import configReducer, {Config} from './config';

export interface State {
    config: Config;
}

export default combineReducers({
    config: configReducer
});