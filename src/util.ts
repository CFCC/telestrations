import {ComponentClass, ComponentType} from "react";
import {StyleRulesCallback, withStyles} from "@material-ui/core";
import {connect} from "react-redux";
import {State as ClientState} from "./client/redux/reducers";
import {CSSProperties} from "@material-ui/core/styles/withStyles";
import {State as ServerState} from "./server/webapp/redux/reducers";

export function connectAndStyle(component: ComponentClass<any, any>,
                                mapStateToProps: (state: ClientState | ServerState) => Object,
                                mapDispatchToProps: Object,
                                styles: StyleRulesCallback | Record<string, CSSProperties>): ComponentType {
    return connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(component));
}