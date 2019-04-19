import React, {Component} from 'react';
// @ts-ignore (there's a types file, and WebStorm sees it, but for some reason typescript does not)
import {SketchField, Tools} from 'react-sketch';
import * as colors from '@material-ui/core/colors'
import {ColorResult, SwatchesPicker} from 'react-color';
import {
    createStyles,
    Dialog,
    Divider,
    Drawer,
    Fab,
    Icon,
    List,
    ListItem,
    ListItemText,
    Theme,
    WithStyles
} from "@material-ui/core";
import {connectAndStyle} from "../util";
import {State} from "../redux/reducers";
import {Slider} from "@material-ui/lab";

const styles = (theme: Theme) => createStyles({
    app: {
        width: '100vw',
        height: '100vh'
    },
    canvas: {
        height: '100% !important'
    },
    list: {
        width: 'auto'
    },
    fab: {
        margin: 2 * theme.spacing.unit,
        position: 'absolute',
        right: 0,
        bottom: 0
    },
    slider: {
        margin: 2 * theme.spacing.unit
    },
    colorPicker: {
        width: '100%',
        height: '100%'
    }
});

const mapStateToProps = (state: State) => ({});

const mapDispatchToProps = {};

interface DrawingState {
    tool: string;
    color: string;
    bgColor: string;
    lineWeight: number;
    colorPickerOpen: boolean;
    bgColorPickerOpen: boolean;
    toolPickerOpen: boolean;
    menuOpen: boolean;
}

type DrawingProps = WithStyles<typeof styles> & typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

class Drawing extends Component<DrawingProps, DrawingState> {
    state = {
        tool: Tools.Pencil,
        color: '#000000',
        bgColor: '#FFFFFF',
        lineWeight: 1,
        toolPickerOpen: false,
        colorPickerOpen: false,
        bgColorPickerOpen: false,
        menuOpen: true
    };

    changeLineWeight = (e: any, lineWeight: number) => this.setState({lineWeight});

    openMenu = () => this.setState({menuOpen: true});
    closeMenu = () => this.setState({menuOpen: false});

    openColorPicker = () => this.setState({colorPickerOpen: true});
    closeColorPicker = () => this.setState({colorPickerOpen: false});
    changeColor = (color: ColorResult) => this.setState({color: color.hex});

    openBgColorPicker = () => this.setState({bgColorPickerOpen: true});
    closeBgColorPicker = () => this.setState({bgColorPickerOpen: false});
    changeBgColor = (color: ColorResult) => this.setState({bgColor: color.hex});

    openToolPicker = () => this.setState({toolPickerOpen: true});
    closeToolPicker = () => this.setState({toolPickerOpen: false});
    changeTool = (tool: string) => this.setState({tool, toolPickerOpen: false});

    // Should these be variables? yeah, but the state wasn't binding correctly
    drawer = () => <Drawer open={this.state.menuOpen} onClose={this.closeMenu}>
        <div
            tabIndex={0}
            role="button"
            onClick={this.closeMenu}
            onKeyDown={this.closeMenu}
        >
            <div className={this.props.classes.list}>
                <List>
                    <ListItem button onClick={this.openToolPicker}>
                        <ListItemText primary="Tool" />
                    </ListItem>
                    <ListItem button onClick={this.openColorPicker}>
                        <ListItemText primary="Line Color" />
                    </ListItem>
                    <ListItem button onClick={this.openBgColorPicker}>
                        <ListItemText primary="Background Color" />
                    </ListItem>
                </List>
                <Divider />
                <Slider min={1}
                        max={100}
                        step={1}
                        value={this.state.lineWeight}
                        className={this.props.classes.slider}
                        onChange={this.changeLineWeight} />
            </div>
        </div>
    </Drawer>;

    colorPicker = () => <Dialog open={this.state.colorPickerOpen} onClose={this.closeColorPicker}>
        <SwatchesPicker colors={Object.values(colors).map(color => Object.values(color))}
                        onChangeComplete={this.changeColor}
                        width={400}
                        color={this.state.color} />
    </Dialog>;

    bgColorPicker = () => <Dialog open={this.state.bgColorPickerOpen} onClose={this.closeBgColorPicker}>
        <SwatchesPicker colors={Object.values(colors).map(color => Object.values(color))}
                        onChangeComplete={this.changeBgColor}
                        width={400}
                        color={this.state.bgColor} />
    </Dialog>;

    toolPicker = () => <Dialog open={this.state.toolPickerOpen} onClose={this.closeToolPicker}>
        <List>
            {['Pencil', 'Line', 'Rectangle', 'Circle', 'Select'].map(tool =>
                <ListItem button onClick={() => this.changeTool(tool.toLowerCase())} key={tool}>
                    <ListItemText primary={tool} />
                </ListItem>
            )}
        </List>
    </Dialog>;

    render() {
        const {classes} = this.props;
        return <div className={classes.app}>
            <SketchField tool={this.state.tool}
                         lineColor={this.state.color}
                         lineWidth={this.state.lineWeight}
                         className={classes.canvas} />
            <Fab color="secondary" aria-label="Edit" className={classes.fab} onClick={this.openMenu}>
                <Icon>edit_icon</Icon>
            </Fab>
            {this.drawer()}
            {this.colorPicker()}
            {this.bgColorPicker()}
            {this.toolPicker()}
        </div>;
    }
}

export default connectAndStyle(Drawing, mapStateToProps, mapDispatchToProps, styles);