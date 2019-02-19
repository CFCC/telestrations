import * as configCreators from '../creators/config';
import * as configActions from '../actions/config';

export interface Config {
    ip: String
}

const defaultState: Config = {
    ip: ''
};

export default function configReducer(state: Config = defaultState, action: configCreators.ConfigCreator): Config {
    switch (action.type) {
        case configActions.SET_IP:
            return Object.assign({}, state, {
                ip: action.ip
            });
        default:
            return state;
    }
}