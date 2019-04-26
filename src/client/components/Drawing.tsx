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
    ListItemText, Paper,
    Theme, Typography,
    WithStyles
} from "@material-ui/core";
import {connectAndStyle} from "../../util";
import {State} from "../redux/reducers";
import * as Actions from '../redux/actions';
import {Slider} from "@material-ui/lab";

const styles = (theme: Theme) => createStyles({
    app: {
        width: '100vw',
        height: '100vh'
    },
    controls: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'row'
    },
    paper: {
        flex: 1,
        margin: 2 * theme.spacing.unit,
        padding: '1em'
    },
    canvas: {
        height: '100% !important'
    },
    list: {
        width: 'auto',
        overflowX: 'hidden'
    },
    fab: {
        margin: 2 * theme.spacing.unit
    },
    slider: {
        margin: 2 * theme.spacing.unit
    },
    colorPicker: {
        width: '100%',
        height: '100%'
    }
});

const mapStateToProps = (state: State) => ({
    thingToDraw: 'hello world!'
});

const mapDispatchToProps = {
    submit: () => Actions.submitGuess(),
    setGuess: (picture: string) => Actions.setGuess(picture)
};

interface DrawingState {
    tool: string;
    color: string;
    bgColor: string;
    lineWeight: number;
    colorPickerOpen: boolean;
    bgColorPickerOpen: boolean;
    toolPickerOpen: boolean;
    menuOpen: boolean;
    canUndo: boolean;
    canRedo: boolean;
}

type DrawingProps = WithStyles<typeof styles> & typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

class Drawing extends Component<DrawingProps, DrawingState> {
    state: DrawingState = {
        tool: Tools.Pencil,
        color: '#000000',
        bgColor: '#FFFFFF',
        lineWeight: 1,
        toolPickerOpen: false,
        colorPickerOpen: false,
        bgColorPickerOpen: false,
        menuOpen: false,
        canUndo: false,
        canRedo: false
    };

    sketch: SketchField = new SketchField({});

    changeLineWeight = (e: any, lineWeight: number) => this.setState({lineWeight});

    openMenu = () => this.setState({menuOpen: true});
    closeMenu = () => this.setState({menuOpen: false});

    openColorPicker = () => this.setState({colorPickerOpen: true});
    closeColorPicker = () => this.setState({colorPickerOpen: false});
    changeColor = (color: ColorResult) => this.setState({color: color.hex, colorPickerOpen: false});

    openBgColorPicker = () => this.setState({bgColorPickerOpen: true});
    closeBgColorPicker = () => this.setState({bgColorPickerOpen: false});
    changeBgColor = (color: ColorResult) => this.setState({bgColor: color.hex, bgColorPickerOpen: false});

    openToolPicker = () => this.setState({toolPickerOpen: true});
    closeToolPicker = () => this.setState({toolPickerOpen: false});
    changeTool = (tool: string) => this.setState({tool, toolPickerOpen: false});

    undo = () => {
        this.sketch.undo();
        this.setState({
            canUndo: this.sketch.canUndo(),
            canRedo: this.sketch.canRedo(),
        });
    };

    redo = () => {
        this.sketch.redo();
        this.setState({
            canUndo: this.sketch.canUndo(),
            canRedo: this.sketch.canRedo(),
        });
    };

    clear = () => {
        this.sketch.clear();
        this.sketch.setBackgroundFromDataUrl('');
        this.setState({
            bgColor: '#FFFFFF',
            canUndo: this.sketch.canUndo(),
            canRedo: this.sketch.canRedo(),
        });
    };

    updateGuess = () => this.props.setGuess(this.sketch ? this.sketch.toDataURL() : '');

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
                <List>
                    <ListItem>
                        <ListItemText primary="Line Weight" />
                    </ListItem>
                    <ListItem>
                        <Slider min={1}
                                max={100}
                                step={1}
                                value={this.state.lineWeight}
                                className={this.props.classes.slider}
                                onChange={this.changeLineWeight} />
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem button onClick={this.undo}>
                        <ListItemText primary="Undo" />
                    </ListItem>
                    <ListItem button onClick={this.redo}>
                        <ListItemText primary="Redo" />
                    </ListItem>
                    <ListItem button onClick={this.clear}>
                        <ListItemText primary="Clear" />
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem button>
                        <ListItemText primary="Submit" />
                    </ListItem>
                </List>
            </div>
        </div>
    </Drawer>;

    colorPicker = () => <Dialog open={this.state.colorPickerOpen} onClose={this.closeColorPicker}>
        <SwatchesPicker colors={Object.values(colors).map(color => Object.values(color).slice(0, 10))}
                        onChangeComplete={this.changeColor}
                        width={400}
                        color={this.state.color} />
    </Dialog>;

    bgColorPicker = () => <Dialog open={this.state.bgColorPickerOpen} onClose={this.closeBgColorPicker}>
        <SwatchesPicker colors={Object.values(colors).map(color => Object.values(color).slice(0, 10))}
                        onChangeComplete={this.changeBgColor}
                        width={400}
                        color={this.state.bgColor} />
    </Dialog>;

    toolPicker = () => <Dialog open={this.state.toolPickerOpen} onClose={this.closeToolPicker}>
        <List>
            {Object.keys(Tools).map(tool =>
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
                         backgroundColor={this.state.bgColor}
                         lineWidth={this.state.lineWeight}
                         className={classes.canvas}
                         onChange={this.updateGuess}
                         ref={c => (c ? this.sketch = c : 0)} />
            <div className={classes.controls}>
                <Fab color="secondary" aria-label="Edit" className={classes.fab} onClick={this.openMenu}>
                    <Icon>menu</Icon>
                </Fab>
                <Paper className={classes.paper}>
                    <Typography variant="h5" component="h3">
                        {this.props.thingToDraw}
                    </Typography>
                </Paper>
            </div>
            {this.drawer()}
            {this.colorPicker()}
            {this.bgColorPicker()}
            {this.toolPicker()}
        </div>;
    }
}

export default connectAndStyle(Drawing, mapStateToProps, mapDispatchToProps, styles);