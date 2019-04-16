import {ComponentClass, ComponentType} from "react";
import {StyleRulesCallback, withStyles} from "@material-ui/core";
import {connect} from "react-redux";
import {State} from "./redux/reducers";
import {CSSProperties} from "@material-ui/core/styles/withStyles";

export function connectAndStyle(component: ComponentClass<any, any>,
                                mapStateToProps: (state: State) => Object,
                                mapDispatchToProps: Object,
                                styles: StyleRulesCallback | Record<string, CSSProperties>): ComponentType {
    return connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(component));
}