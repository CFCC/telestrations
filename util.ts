import {ComponentClass, ComponentType} from "react";
import {Dispatch} from "redux";
import {StyleRulesCallback, withStyles} from "@material-ui/core";
import {connect} from "react-redux";
import {State} from "./src/client/reducers";

export function connectAndStyle(component: ComponentClass<any, any>,
                                mapStateToProps: (state: State) => Object,
                                mapDispatchToProps: (dispatch: Dispatch) => Object,
                                styles: StyleRulesCallback): ComponentType {
    return connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(component));
}