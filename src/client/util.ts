import {Component, ComponentType} from "react";
import {Dispatch} from "redux";
import {withStyles, WithStyles} from "@material-ui/core";
import {connect} from "react-redux";
import {State} from "./reducers";

export function connectAndStyle
(component: any, mapStateToProps: (state: State) => Object,
 mapDispatchToProps: (dispatch: Dispatch) => Object, styles: any) {
    return connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(component));
}