import * as configActions from '../actions/config';

export interface setIp {
    type: configActions.SET_IP;
    ip: String
}
export function setIp(ip: String): setIp {
    return {
        type: configActions.SET_IP,
        ip
    };
}

export type ConfigCreator = setIp