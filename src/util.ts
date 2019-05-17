import {ComponentType} from "react";
import {StyleRulesCallback, WithStyles, withStyles} from "@material-ui/core";
import {connect, ConnectedComponentClass} from "react-redux";
import {CSSProperties} from "@material-ui/core/styles/withStyles";

export function connectAndStyle<OwnProps = {}>(component: ComponentType<any>,
                                               mapStateToProps: (state: any) => Object,
                                               mapDispatchToProps: Object,
                                               styles: StyleRulesCallback | Record<string, CSSProperties>
): ConnectedComponentClass<ComponentType, OwnProps> {
    return connect<ReturnType<typeof mapStateToProps>,
        typeof mapDispatchToProps,
        OwnProps>(mapStateToProps, mapDispatchToProps)(withStyles(styles)(component));
}

export function sleep(t: number) {
    return new Promise(res => setTimeout(res, t));
}