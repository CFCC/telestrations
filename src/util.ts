import {ComponentType} from "react";
import {StyleRulesCallback, withStyles} from "@material-ui/core";
import {connect, ConnectedComponentClass} from "react-redux";
import {CSSProperties} from "@material-ui/core/styles/withStyles";

// TODO: This needs tightened, but i'm tired of fighting typescript on how
export function connectAndStyle<OwnProps = {}>(component: any,
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